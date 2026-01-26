from decimal import Decimal

from django.db import transaction
from rest_framework import serializers

from catalog.models import Product
from orders.models import Order, OrderItem


class OrderItemSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)


class OrderItemDetailSerializer(serializers.ModelSerializer):
    product_id = serializers.IntegerField(source="product.id", read_only=True)
    product_name = serializers.CharField(source="product.name", read_only=True)
    product_image = serializers.ImageField(source="product.image", read_only=True)

    class Meta:
        model = OrderItem
        fields = ["product_id", "product_name", "product_image", "quantity", "price"]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, write_only=True)
    items_detail = OrderItemDetailSerializer(source="items", many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "full_name",
            "email",
            "address",
            "created_at",
            "total_amount",
            "status",
            "items",
            "items_detail",
        ]
        read_only_fields = ["id", "created_at", "total_amount", "status"]

    def create(self, validated_data):
        items_data = validated_data.pop("items", [])
        product_ids = [item["product_id"] for item in items_data]
        products = Product.objects.in_bulk(product_ids)

        missing_ids = [pid for pid in product_ids if pid not in products]
        if missing_ids:
            raise serializers.ValidationError(
                {"items": f"Invalid product_id(s): {missing_ids}"}
            )

        with transaction.atomic():
            order = Order.objects.create(**validated_data)
            total = Decimal("0.00")

            for item in items_data:
                product = products[item["product_id"]]
                quantity = item["quantity"]
                line_total = product.price * quantity
                total += line_total

                OrderItem.objects.create(
                    order=order,
                    product=product,
                    quantity=quantity,
                    price=product.price,
                )

            order.total_amount = total
            order.save(update_fields=["total_amount"])

        return order
