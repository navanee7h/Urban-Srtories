from django.contrib import admin
from .models import Product


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'price', 'color', 'fit', 'category']
    list_filter = ['color', 'fit', 'category']
    search_fields = ['name', 'description']
