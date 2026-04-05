from django.db import models
from django.contrib.auth.models import User
from products.models import Product

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    country_code = models.CharField(max_length=5, blank=True)
    phone_number = models.CharField(max_length=15, blank=True)
    measurements = models.JSONField(null=True, blank=True, default=dict)

    def __str__(self):
        return f"{self.user.username}'s Profile"


class Order(models.Model):
    STATUS_CHOICES = [
        ('Processing', 'Processing'),
        ('Shipped', 'Shipped'),
        ('Delivered', 'Delivered'),
        ('Cancelled', 'Cancelled'),
    ]

    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='Processing')
    total = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=50, default='cod')
    shipping_name = models.CharField(max_length=255)
    shipping_email = models.EmailField()
    shipping_phone = models.CharField(max_length=20)
    shipping_address = models.TextField()
    shipping_city = models.CharField(max_length=100)
    shipping_state = models.CharField(max_length=100)
    shipping_pincode = models.CharField(max_length=10)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Order #{self.id} - {self.status}"

    class Meta:
        ordering = ['-created_at']


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    size = models.CharField(max_length=10)
    fit = models.CharField(max_length=50)
    quantity = models.PositiveIntegerField(default=1)
    custom_charge = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    measurements = models.JSONField(null=True, blank=True)

    def __str__(self):
        return f"{self.product.name} x{self.quantity}"
