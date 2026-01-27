from django.conf import settings
from django.core.mail import send_mail
from django.shortcuts import get_object_or_404
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
import stripe

from orders.models import Order
from orders.serializers import OrderSerializer

from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
import stripe


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.prefetch_related("items").all()
    serializer_class = OrderSerializer

    # --- CORRE��O AQUI: getattr para evitar erro 500 ---
    def get_authenticators(self):
        # Tenta pegar a a��o de forma segura. Se n�o existir, retorna None.
        action = getattr(self, "action", None)

        # Se for criar pedido ou checkout, retorna lista vazia (sem autentica��o)
        if action in ["create", "create_checkout_session"]:
            return []

        return super().get_authenticators()

    def get_permissions(self):
        # Se for POST (qualquer cria��o), libera geral
        if self.request.method == "POST":
            return [permissions.AllowAny()]

        # Para ver a lista (GET), precisa estar logado
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        # Se for usu�rio an�nimo (visitante), retorna nada (seguran�a)
        if not user or user.is_anonymous:
            return Order.objects.none()
        return Order.objects.filter(user=user)

    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            serializer.save(user=self.request.user)
        else:
            serializer.save()

    # --- A��o de Checkout do Stripe ---
    @action(detail=False, methods=["post"], url_path="create-checkout-session")
    def create_checkout_session(self, request):
        print("--- Iniciando Checkout Session ---")  # Debug

        order_id = request.data.get("order_id")
        if not order_id:
            return Response(
                {"detail": "order_id is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        stripe.api_key = settings.STRIPE_SECRET_KEY

        try:
            order = Order.objects.get(id=order_id)
        except Order.DoesNotExist:
            return Response(
                {"detail": "Order not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        line_items = []
        for item in order.items.all():
            # Converter pre�o para centavos (inteiro)
            unit_amount = int(item.price * 100)
            line_items.append(
                {
                    "price_data": {
                        "currency": "brl",
                        "product_data": {"name": item.product.name},
                        "unit_amount": unit_amount,
                    },
                    "quantity": item.quantity,
                }
            )

        success_url = (
            f"{settings.FRONTEND_URL}"
            "/checkout/success?session_id={CHECKOUT_SESSION_ID}"
        )

        cancel_url = f"{settings.FRONTEND_URL}/checkout"

        try:
            session = stripe.checkout.Session.create(
                mode="payment",
                line_items=line_items,
                success_url=success_url,
                cancel_url=cancel_url,
                metadata={"order_id": str(order.id)},
            )
        except stripe.error.StripeError as exc:
            return Response(
                {"detail": "Failed to create payment session.", "error": str(exc)},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        return Response({"url": session.url}, status=status.HTTP_200_OK)


@csrf_exempt
def stripe_webhook_view(request):
    payload = request.body
    sig_header = request.META.get("HTTP_STRIPE_SIGNATURE")
    event = None

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
    except ValueError as e:
        return HttpResponse(status=400)
    except stripe.error.SignatureVerificationError as e:
        return HttpResponse(status=400)

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]

        order_id = session.get("metadata", {}).get("order_id")

        if order_id:
            try:
                order = Order.objects.get(id=order_id)
                order.status = "paid"
                order.save()
                # Envio de email de confirma��o
                try:

                    sent = send_mail(
                        subject=f"Pedido #{order.id} Confirmado! ??",
                        message=(
                            f"Ol� {order.full_name}, seu pagamento de R$ "
                            f"{order.total_amount} foi confirmado. Seus produtos "
                            "j� est�o liberados!"
                        ),
                        from_email=settings.DEFAULT_FROM_EMAIL,  # <- importante
                        recipient_list=[order.email],
                        fail_silently=False,  # <- importante
                    )

                    print(f"[EMAIL] send_mail retornou={sent} to={order.email} order_id={order.id}")
                except Exception as e:
                    print(f" Erro ao enviar email: {e}")
                print(f"PEDIDO {order_id} ATUALIZADO PARA PAGO!")
            except Order.DoesNotExist:
                print(f"Pedido {order_id} n�o encontrado.")

    return HttpResponse(status=200)