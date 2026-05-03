import { useState, useEffect } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../components/ProductCardSkeleton';
import type { Product } from '../data/products';
import { fetchProducts } from '../data/api';
import { Button } from '../components/ui/button';
import { Checkbox } from '../components/ui/checkbox';
import { Label } from '../components/ui/label';
import { Slider } from '../components/ui/slider';

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    sizes: [] as string[],
    colors: [] as string[],
    fits: [] as string[],
    priceRange: [0, 5000] as [number, number],
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const availableSizes = ['S', 'M', 'L', 'XL'];
  const availableColors = [...new Set(products.map(p => p.color))];
  const availableFits = ['Slim', 'Regular'];

  const filteredProducts = products.filter(product => {
    const sizeMatch = filters.sizes.length === 0 ||
      filters.sizes.some((size) => {
        return product.sizes && typeof product.sizes === 'object' && product.sizes[size] > 0;
      });
    const colorMatch = filters.colors.length === 0 || 
      filters.colors.includes(product.color);
    const fitMatch = filters.fits.length === 0 || 
      filters.fits.includes(product.fit);
    const priceMatch = product.price >= filters.priceRange[0] && 
      product.price <= filters.priceRange[1];
    
    return sizeMatch && colorMatch && fitMatch && priceMatch;
  });

  const toggleFilter = (category: 'sizes' | 'colors' | 'fits', value: string) => {
    setFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value]
    }));
  };

  const clearFilters = () => {
    setFilters({
      sizes: [],
      colors: [],
      fits: [],
      priceRange: [0, 5000],
    });
  };

  const FilterSection = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-lg">Filters</h3>
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          Clear All
        </Button>
      </div>

      {/* Size Filter */}
      <div className="space-y-3">
        <h4 className="text-sm uppercase tracking-wider text-muted-foreground">Size</h4>
        <div className="space-y-2">
          {availableSizes.map(size => (
            <div key={size} className="flex items-center space-x-2">
              <Checkbox
                id={`size-${size}`}
                checked={filters.sizes.includes(size)}
                onCheckedChange={() => toggleFilter('sizes', size)}
              />
              <Label htmlFor={`size-${size}`} className="cursor-pointer font-normal">
                {size}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Color Filter */}
      <div className="space-y-3">
        <h4 className="text-sm uppercase tracking-wider text-muted-foreground">Color</h4>
        <div className="space-y-2">
          {availableColors.map(color => (
            <div key={color} className="flex items-center space-x-2">
              <Checkbox
                id={`color-${color}`}
                checked={filters.colors.includes(color)}
                onCheckedChange={() => toggleFilter('colors', color)}
              />
              <Label htmlFor={`color-${color}`} className="cursor-pointer font-normal">
                {color}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Fit Filter */}
      <div className="space-y-3">
        <h4 className="text-sm uppercase tracking-wider text-muted-foreground">Fit</h4>
        <div className="space-y-2">
          {availableFits.map(fit => (
            <div key={fit} className="flex items-center space-x-2">
              <Checkbox
                id={`fit-${fit}`}
                checked={filters.fits.includes(fit)}
                onCheckedChange={() => toggleFilter('fits', fit)}
              />
              <Label htmlFor={`fit-${fit}`} className="cursor-pointer font-normal">
                {fit}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <h4 className="text-sm uppercase tracking-wider text-muted-foreground">Price Range</h4>
        <div className="pt-2">
          <Slider
            value={filters.priceRange}
            onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value as [number, number] }))}
            min={0}
            max={5000}
            step={100}
            className="mb-4"
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>₹{filters.priceRange[0]}</span>
            <span>₹{filters.priceRange[1]}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Header */}
        <div className="border-b border-border bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <h1 className="text-3xl md:text-4xl mb-4">Shop Collection</h1>
            <p className="text-muted-foreground max-w-2xl">
              Explore our complete range of men's shirts in linen, cotton, and imported fabrics. Each piece is crafted for comfort, fit, and timeless style.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Desktop Filters */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24">
                <FilterSection />
              </div>
            </aside>

            {/* Mobile Filter Button */}
            <div className="lg:hidden">
              <Button
                variant="outline"
                onClick={() => setShowMobileFilters(true)}
                className="w-full"
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>

            {/* Mobile Filters Overlay */}
            {showMobileFilters && (
              <div className="fixed inset-0 z-50 lg:hidden">
                <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileFilters(false)} />
                <div className="absolute right-0 top-0 bottom-0 w-80 max-w-full bg-background shadow-2xl overflow-y-auto">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg">Filters</h3>
                      <button onClick={() => setShowMobileFilters(false)}>
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                    <FilterSection />
                  </div>
                </div>
              </div>
            )}

            {/* Products Grid */}
            <div className="flex-1">
              <div className="mb-6">
                <p className="text-sm text-muted-foreground">
                  {loading ? 'Loading...' : `${filteredProducts.length} ${filteredProducts.length === 1 ? 'product' : 'products'}`}
                </p>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  <ProductCardSkeleton />
                  <ProductCardSkeleton />
                  <ProductCardSkeleton />
                  <ProductCardSkeleton />
                  <ProductCardSkeleton />
                  <ProductCardSkeleton />
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-muted-foreground mb-4">No products found matching your filters.</p>
                  <Button variant="outline" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
