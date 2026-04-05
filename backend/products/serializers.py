from rest_framework import serializers
from .models import Product


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'image', 'image_file', 'color', 'description', 'sizes', 'fit', 'fabric', 'category']

    def validate_sizes(self, value):
        if isinstance(value, str):
            import json
            try:
                return json.loads(value)
            except ValueError:
                pass
        return value
