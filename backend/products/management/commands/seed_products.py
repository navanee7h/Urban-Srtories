from django.core.management.base import BaseCommand
from products.models import Product


class Command(BaseCommand):
    help = 'Seed the database with initial product data'

    def handle(self, *args, **options):
        products_data = [
            {
                'name': 'Classic White Linen Shirt',
                'price': 3499,
                'image': 'https://images.unsplash.com/photo-1618677603544-51162346e165?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMGxpbmVuJTIwc2hpcnQlMjBtaW5pbWFsaXN0fGVufDF8fHx8MTc3NDg4MzgyNnww&ixlib=rb-4.1.0&q=80&w=1080',
                'color': 'White',
                'description': 'Timeless white linen shirt crafted from premium 100% linen fabric. Perfect for warm weather, offering breathability and sophisticated style.',
                'sizes': {'S': 10, 'M': 15, 'L': 5, 'XL': 0},
                'fit': 'Regular',
                'fabric': '100% Premium Linen',
                'category': 'Shirts',
            },
            {
                'name': 'Natural Beige Linen Shirt',
                'price': 3699,
                'image': 'https://images.unsplash.com/photo-1666358066384-26972e4c0461?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWlnZSUyMGxpbmVuJTIwc2hpcnQlMjBwcm9kdWN0JTIwcGhvdG9ncmFwaHl8ZW58MXx8fHwxNzc0ODgzODI2fDA&ixlib=rb-4.1.0&q=80&w=1080',
                'color': 'Beige',
                'description': 'Elegant beige linen shirt in a natural earth tone. Premium quality fabric that gets softer with every wash.',
                'sizes': {'S': 5, 'M': 12, 'L': 10, 'XL': 8},
                'fit': 'Regular',
                'fabric': '100% Premium Linen',
                'category': 'Shirts',
            },
            {
                'name': 'Sand Linen Shirt',
                'price': 3599,
                'image': 'https://images.unsplash.com/photo-1722127150271-e1638eeff425?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYW5kJTIwYmVpZ2UlMjBsaW5lbiUyMHNoaXJ0JTIwZGV0YWlsfGVufDF8fHx8MTc3NDg4MzgyOHww&ixlib=rb-4.1.0&q=80&w=1080',
                'color': 'Sand',
                'description': 'Warm sand-toned linen shirt perfect for coastal getaways and summer evenings. Lightweight and breathable.',
                'sizes': {'S': 0, 'M': 5, 'L': 15, 'XL': 5},
                'fit': 'Slim',
                'fabric': '100% Premium Linen',
                'category': 'Shirts',
            },
            {
                'name': 'Sky Blue Linen Shirt',
                'price': 3799,
                'image': 'https://images.unsplash.com/photo-1732605559386-bc59426d1b16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaWdodCUyMGJsdWUlMjBsaW5lbiUyMHNoaXJ0JTIwZWxlZ2FudHxlbnwxfHx8fDE3NzQ4ODM4Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080',
                'color': 'Blue',
                'description': 'Light sky blue linen shirt that combines elegance with comfort. A versatile piece for any wardrobe.',
                'sizes': {'S': 20, 'M': 20, 'L': 10, 'XL': 2},
                'fit': 'Regular',
                'fabric': '100% Premium Linen',
                'category': 'Shirts',
            },
            {
                'name': 'Olive Green Linen Shirt',
                'price': 3799,
                'image': 'https://images.unsplash.com/photo-1685703206291-2c851a733119?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbGl2ZSUyMGdyZWVuJTIwbGluZW4lMjBzaGlydHxlbnwxfHx8fDE3NzQ4ODM4MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
                'color': 'Olive',
                'description': 'Sophisticated olive green linen shirt with a modern aesthetic. Perfect for casual luxury styling.',
                'sizes': {'S': 8, 'M': 2, 'L': 0, 'XL': 0},
                'fit': 'Slim',
                'fabric': '100% Premium Linen',
                'category': 'Shirts',
            },
            {
                'name': 'Charcoal Grey Linen Shirt',
                'price': 3899,
                'image': 'https://images.unsplash.com/photo-1608234808654-2a8875faa7fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmV5JTIwbGluZW4lMjBzaGlydCUyMG1lbnMlMjBmYXNoaW9ufGVufDF8fHx8MTc3NDg4MzgyN3ww&ixlib=rb-4.1.0&q=80&w=1080',
                'color': 'Grey',
                'description': 'Contemporary charcoal grey linen shirt. A statement piece that transitions effortlessly from day to night.',
                'sizes': {'S': 10, 'M': 10, 'L': 10, 'XL': 10},
                'fit': 'Regular',
                'fabric': '100% Premium Linen',
                'category': 'Shirts',
            },
        ]

        created_count = 0
        for data in products_data:
            _, created = Product.objects.get_or_create(
                name=data['name'],
                defaults=data,
            )
            if created:
                created_count += 1

        self.stdout.write(
            self.style.SUCCESS(f'Seeded {created_count} new products ({Product.objects.count()} total)')
        )
