from rest_framework import serializers
from .models import Order, OrderItem
from products.serializers import ProductSerializer


class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_id', 'size', 'fit', 'quantity', 'custom_charge', 'measurements']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'status', 'total', 'payment_method',
            'shipping_name', 'shipping_email', 'shipping_phone',
            'shipping_address', 'shipping_city', 'shipping_state', 'shipping_pincode',
            'created_at', 'items',
        ]
        read_only_fields = ['id', 'status', 'created_at']


class CreateOrderSerializer(serializers.Serializer):
    items = serializers.ListField(child=serializers.DictField())
    shipping_address = serializers.DictField()
    payment_method = serializers.CharField()
    total = serializers.DecimalField(max_digits=10, decimal_places=2)

    def create(self, validated_data):
        shipping = validated_data['shipping_address']
        order = Order.objects.create(
            total=validated_data['total'],
            payment_method=validated_data['payment_method'],
            shipping_name=shipping.get('name', ''),
            shipping_email=shipping.get('email', ''),
            shipping_phone=shipping.get('phone', ''),
            shipping_address=shipping.get('address', ''),
            shipping_city=shipping.get('city', ''),
            shipping_state=shipping.get('state', ''),
            shipping_pincode=shipping.get('pincode', ''),
        )

        for item_data in validated_data['items']:
            OrderItem.objects.create(
                order=order,
                product_id=item_data['product_id'],
                size=item_data.get('size', ''),
                fit=item_data.get('fit', 'Standard'),
                quantity=item_data.get('quantity', 1),
                custom_charge=item_data.get('custom_charge', 0) or 0,
                measurements=item_data.get('measurements'),
            )

        return order
