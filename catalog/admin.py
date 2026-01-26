from django.contrib import admin

from catalog.ai_services import generate_product_description
from catalog.models import Category, Product


def make_description_with_ai(modeladmin, request, queryset):
    for product in queryset:
        description = generate_product_description(product.name)
        if description:
            product.description = description
            product.save(update_fields=["description"])


make_description_with_ai.short_description = "Gerar descricao curta com IA"


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("name",)}
    actions = [make_description_with_ai]
