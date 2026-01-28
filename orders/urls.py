from django.urls import path, include
from rest_framework.routers import DefaultRouter
from orders.views import OrderViewSet, stripe_webhook_view, test_resend_view

router = DefaultRouter()
router.register(r'orders', OrderViewSet, basename='orders')

urlpatterns = [
    path('', include(router.urls)),
    path('webhook/', stripe_webhook_view, name='stripe-webhook'),
    path('test-resend/', test_resend_view, name='test-resend'),
]
