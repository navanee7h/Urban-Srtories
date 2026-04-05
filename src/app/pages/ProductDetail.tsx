import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { Minus, Plus, Truck, RotateCcw, Ruler, Check } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import type { Product } from '../data/products';
import { fetchProduct } from '../data/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';

export default function ProductDetail() {
  const { id } = useParams();
  const { addItem } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [fitType, setFitType] = useState<'Standard' | 'Custom'>('Standard');
  const [measurements, setMeasurements] = useState({
    chest: '',
    shoulder: '',
    sleeveLength: '',
    shirtLength: '',
    neck: '',
  });
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchProduct(id)
      .then(setProduct)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (user && user.measurements) {
      setMeasurements({
        chest: user.measurements.chest || '',
        shoulder: user.measurements.shoulder || '',
        sleeveLength: user.measurements.sleeveLength || '',
        shirtLength: user.measurements.shirtLength || '',
        neck: user.measurements.neck || '',
      });
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading product...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl mb-4">Product not found</h2>
            <Link to="/shop">
              <Button>Back to Shop</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const customCharge = fitType === 'Custom' ? 500 : 0;
  const totalPrice = (product.price + customCharge) * quantity;

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    if (fitType === 'Custom') {
      const missingMeasurements = Object.entries(measurements)
        .filter(([_, value]) => !value)
        .map(([key]) => key);
      
      if (missingMeasurements.length > 0) {
        alert('Please fill in all measurements for custom tailoring');
        return;
      }
    }
    
    addItem({
      product,
      quantity,
      size: selectedSize,
      fit: fitType,
      ...(fitType === 'Custom' && {
        customCharge: 500,
        measurements,
      }),
    });

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* Breadcrumb */}
          <div className="mb-8 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/shop" className="hover:text-primary">Shop</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{product.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="aspect-[3/4] overflow-hidden rounded-sm bg-muted">
                <img
                  src={product.image_file || product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl md:text-4xl mb-3">{product.name}</h1>
                <p className="text-2xl">₹{product.price.toLocaleString('en-IN')}</p>
              </div>

              <div className="prose prose-sm">
                <p className="text-muted-foreground">{product.description}</p>
              </div>

              {/* Fabric Details */}
              <div className="border-t border-b border-border py-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Fabric:</span>
                  <span>{product.fabric}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Color:</span>
                  <span>{product.color}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Fit:</span>
                  <span>{product.fit}</span>
                </div>
              </div>

              {/* Size Selection */}
              <div className="space-y-3">
                <Label>Select Size</Label>
                <div className="flex gap-2">
                  {Object.entries(product.sizes || {}).map(([size, stockAmount]) => {
                    const isOutOfStock = Number(stockAmount) <= 0;
                    return (
                      <button
                        key={size}
                        disabled={isOutOfStock}
                        onClick={() => setSelectedSize(size)}
                        className={`w-14 h-14 flex items-center justify-center font-medium border rounded-sm transition-colors ${
                          isOutOfStock
                            ? 'opacity-50 cursor-not-allowed bg-muted text-muted-foreground border-transparent'
                            : selectedSize === size
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-border hover:border-primary'
                        }`}
                        title={isOutOfStock ? "Out of Stock" : `In Stock: ${stockAmount}`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Fit Type Selection */}
              <div className="space-y-3">
                <Label>Fit Type</Label>
                <RadioGroup value={fitType} onValueChange={(value) => setFitType(value as 'Standard' | 'Custom')}>
                  <div className="flex items-center space-x-2 p-3 border border-border rounded-sm">
                    <RadioGroupItem value="Standard" id="standard" />
                    <Label htmlFor="standard" className="flex-1 cursor-pointer font-normal">
                      Standard Fit
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border border-border rounded-sm">
                    <RadioGroupItem value="Custom" id="custom" />
                    <Label htmlFor="custom" className="flex-1 cursor-pointer font-normal">
                      Custom Tailoring <span className="text-muted-foreground">(+₹500)</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Custom Measurements */}
              {fitType === 'Custom' && (
                <div className="space-y-4 p-4 bg-muted rounded-sm">
                  <div className="flex items-center justify-between">
                    <Label className="text-base">Enter Measurements (in inches)</Label>
                    <Link to="/measurement-guide" className="text-sm text-primary hover:underline flex items-center gap-1">
                      <Ruler className="w-4 h-4" />
                      Guide
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="chest">Chest</Label>
                      <Input
                        id="chest"
                        type="number"
                        placeholder="e.g., 40"
                        value={measurements.chest}
                        onChange={(e) => setMeasurements({...measurements, chest: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shoulder">Shoulder</Label>
                      <Input
                        id="shoulder"
                        type="number"
                        placeholder="e.g., 17"
                        value={measurements.shoulder}
                        onChange={(e) => setMeasurements({...measurements, shoulder: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sleeve">Sleeve Length</Label>
                      <Input
                        id="sleeve"
                        type="number"
                        placeholder="e.g., 24"
                        value={measurements.sleeveLength}
                        onChange={(e) => setMeasurements({...measurements, sleeveLength: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="length">Shirt Length</Label>
                      <Input
                        id="length"
                        type="number"
                        placeholder="e.g., 29"
                        value={measurements.shirtLength}
                        onChange={(e) => setMeasurements({...measurements, shirtLength: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="neck">Neck</Label>
                      <Input
                        id="neck"
                        type="number"
                        placeholder="e.g., 15"
                        value={measurements.neck}
                        onChange={(e) => setMeasurements({...measurements, neck: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="space-y-3">
                <Label>Quantity</Label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-border rounded-sm">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 hover:bg-muted transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-6 py-3 border-x border-border min-w-[60px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-3 hover:bg-muted transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total: ₹{totalPrice.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Add to Cart Button */}
              <Button 
                size="lg" 
                className="w-full"
                onClick={handleAddToCart}
              >
                {addedToCart ? (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    Added to Cart!
                  </>
                ) : (
                  'Add to Cart'
                )}
              </Button>

              {/* Delivery Info */}
              <div className="space-y-3 pt-4 border-t border-border">
                <div className="flex items-start gap-3">
                  <Truck className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Free Delivery</p>
                    <p className="text-sm text-muted-foreground">On orders above ₹2,999. Delivered in 5-7 days.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <RotateCcw className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Easy Returns</p>
                    <p className="text-sm text-muted-foreground">30-day return policy for all products.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
