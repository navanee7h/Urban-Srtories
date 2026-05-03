import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Shirt, Globe, Sparkles, ArrowRight, Palette } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../components/ProductCardSkeleton';
import ShopTheLook from '../components/ShopTheLook';
import type { Product } from '../data/products';
import { fetchProducts } from '../data/api';
import { Button } from '../components/ui/button';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts()
      .then((data) => setFeaturedProducts(data.slice(0, 3)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[85vh] md:h-[90vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1763293203875-4883b6716a8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjB3ZWFyaW5nJTIwbGluZW4lMjBzaGlydCUyMG91dGRvb3IlMjBuYXR1cmFsfGVufDF8fHx8MTc3NDg4MzgyNXww&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Man wearing linen shirt"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/40 to-transparent" />
          </div>

          <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl mb-6 tracking-tight text-foreground font-semibold">
              Shirts That Tell<br />Your Story.
            </h1>
            <p className="text-base md:text-lg text-foreground/90 font-medium mb-8 max-w-xl mx-auto">
              Premium men's shirts in linen, cotton &amp; imported fabrics — crafted for comfort, style, and every occasion.
            </p>
            <Link to="/shop">
              <Button size="lg" className="px-8 py-6 text-base">
                Shop Collection
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Shop The Look Interactive Component */}
        <ShopTheLook />

        {/* Featured Products */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4">Featured Collection</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover our bestselling shirts in linen, imported cotton, and premium blends — designed for the modern man.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
            {loading ? (
              <>
                <ProductCardSkeleton />
                <ProductCardSkeleton />
                <ProductCardSkeleton />
              </>
            ) : (
              featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>

          <div className="text-center">
            <Link to="/shop">
              <Button variant="outline" size="lg">
                View All Products
              </Button>
            </Link>
          </div>
        </section>

        {/* Why Urban Stories Section */}
        <section className="bg-muted py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl mb-4">Why Urban Stories?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Premium fabrics, curated styles, and a commitment to quality that sets us apart.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {/* Curated Fabrics */}
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-background shadow-sm">
                  <Palette className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl">Curated Fabrics</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  From breathable linens to premium imported cottons — we handpick every fabric for quality and feel.
                </p>
              </div>

              {/* Imported Materials */}
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-background shadow-sm">
                  <Globe className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl">Imported Materials</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Sourced from the world's best mills — fine cotton, linen blends, and exclusive imported fabrics.
                </p>
              </div>

              {/* Crafted for Men */}
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-background shadow-sm">
                  <Shirt className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl">Crafted for Men</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Every shirt is designed exclusively for men — tailored fits, refined collars, and versatile styles.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Brand Statement */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl">
                Crafted for the Modern Man
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  At Urban Stories, we believe a great shirt is the foundation of every man's wardrobe. 
                  We bring together linen, cotton, and the finest imported fabrics to create shirts that look and feel exceptional.
                </p>
                <p>
                  From casual weekends to sharp office looks, our collection is designed to keep you 
                  comfortable, confident, and styled for every chapter of your story.
                </p>
              </div>
              <Link to="/about">
                <Button size="lg" variant="outline">
                  Explore Our Story
                </Button>
              </Link>
            </div>

            <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
              <img
                src="https://images.unsplash.com/photo-1633381248830-5e53860ffcf9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBsaW5lbiUyMHNoaXJ0JTIwbHV4dXJ5JTIwbGlmZXN0eWxlfGVufDF8fHx8MTc3NDg4MzgyOHww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Man in linen shirt"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary text-primary-foreground py-16 md:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl mb-4">
              Find Your Perfect Fit
            </h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Choose from standard sizes or opt for custom tailoring with our measurement guide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/shop">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  Shop Now
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary">
                  About Us
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
