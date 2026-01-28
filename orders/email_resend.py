import os
from typing import Optional

import requests


def send_order_confirmation_email(order, idempotency_key: Optional[str] = None) -> Optional[str]:
    url = "https://api.resend.com/emails"
    headers = {
        "Authorization": f"Bearer {os.environ.get('RESEND_API_KEY')}",
        "Content-Type": "application/json",
    }
    if idempotency_key:
        headers["Idempotency-Key"] = idempotency_key

    from_email = os.environ.get("RESEND_FROM") or "Loja IA <onboarding@resend.dev>"
    subject = f"Pedido #{order.id} Confirmado! 🚀"
    html = (
        f"<p>Olá {order.full_name},</p>"
        "<p>Pagamento confirmado! Seu pedido foi recebido com sucesso.</p>"
        f"<p>Total: R$ {order.total_amount}</p>"
        "<p>Obrigado por comprar com a Loja IA.</p>"
    )
    text = (
        f"Olá {order.full_name},\n\n"
        "Pagamento confirmado! Seu pedido foi recebido com sucesso.\n"
        f"Total: R$ {order.total_amount}\n\n"
        "Obrigado por comprar com a Loja IA."
    )

    payload = {
        "from": from_email,
        "to": order.email,
        "subject": subject,
        "html": html,
        "text": text,
    }

    response = requests.post(url, json=payload, headers=headers, timeout=10)
    if not (200 <= response.status_code < 300):
        raise Exception(response.text)

    data = response.json()
    return data.get("id")
