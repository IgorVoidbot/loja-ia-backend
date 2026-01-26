from django.db import models
from rest_framework import permissions, viewsets

from catalog.models import Category, Product
from catalog.serializers import CategorySerializer, ProductSerializer


class ReadOnlyOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.method in permissions.SAFE_METHODS or (
            request.user and request.user.is_staff
        )


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [ReadOnlyOrAdmin]

    def get_queryset(self):
        queryset = super().get_queryset()
        search = self.request.query_params.get("search")
        category_slug = self.request.query_params.get("category")

        if search:
            queryset = queryset.filter(
                models.Q(name__icontains=search)
                | models.Q(description__icontains=search)
            )

        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)

        return queryset
