from django.contrib import admin
from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['product', 'size', 'fit', 'quantity', 'custom_charge']


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'shipping_name', 'status', 'total', 'payment_method', 'created_at']
    list_filter = ['status', 'payment_method']
    search_fields = ['shipping_name', 'shipping_email']
    inlines = [OrderItemInline]
