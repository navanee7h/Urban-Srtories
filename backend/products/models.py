from django.db import models


class Product(models.Model):
    name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.URLField(max_length=1000, blank=True)
    image_file = models.ImageField(upload_to='products/', null=True, blank=True)
    color = models.CharField(max_length=100)
    description = models.TextField()
    sizes = models.JSONField(default=dict)
    fit = models.CharField(max_length=100)
    fabric = models.CharField(max_length=255)
    category = models.CharField(max_length=100)

    def __str__(self):
        return self.name
