from django.urls import path, include
from rest_framework.routers import DefaultRouter
from orders.views import OrderViewSet, stripe_webhook_view # Importe a nova view

router = DefaultRouter()
router.register(r'orders', OrderViewSet, basename='orders')

urlpatterns = [
    path('', include(router.urls)),
    path('webhook/', stripe_webhook_view, name='stripe-webhook'),
]