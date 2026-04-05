import { Link } from 'react-router';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { items: cartItems, removeItem, updateQuantity } = useCart();

  const subtotal = cartItems.reduce((sum, item) => {
    const itemPrice = item.product.price + (item.customCharge || 0);
    return sum + (itemPrice * item.quantity);
  }, 0);

  const shipping = subtotal >= 2999 ? 0 : 200;
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4 px-4">
            <h2 className="text-2xl">Your cart is empty</h2>
            <p className="text-muted-foreground">Add some beautiful linen shirts to get started.</p>
            <Link to="/shop">
              <Button size="lg">
                Shop Collection
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <h1 className="text-3xl md:text-4xl mb-8">Shopping Cart</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map((item, index) => (
                <div key={index} className="border border-border rounded-sm p-4 md:p-6">
                  <div className="flex gap-4 md:gap-6">
                    {/* Product Image */}
                    <Link to={`/product/${item.product.id}`} className="flex-shrink-0">
                      <div className="w-24 h-32 md:w-32 md:h-40 rounded-sm overflow-hidden bg-muted">
                        <img
                          src={item.product.image_file || item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </Link>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-4">
                        <div className="space-y-1 flex-1">
                          <Link to={`/product/${item.product.id}`}>
                            <h3 className="font-medium hover:text-muted-foreground transition-colors">
                              {item.product.name}
                            </h3>
                          </Link>
                          <p className="text-sm text-muted-foreground">{item.product.color}</p>
                          <p className="text-sm text-muted-foreground">Size: {item.size}</p>
                          <p className="text-sm text-muted-foreground">
                            Fit: {item.fit}
                            {item.fit === 'Custom' && ' (+₹500)'}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(index)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Custom Measurements */}
                      {item.fit === 'Custom' && item.measurements && (
                        <div className="mt-3 pt-3 border-t border-border">
                          <p className="text-xs text-muted-foreground mb-2">Custom Measurements (inches):</p>
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            <span>Chest: {item.measurements.chest}</span>
                            <span>Shoulder: {item.measurements.shoulder}</span>
                            <span>Sleeve: {item.measurements.sleeveLength}</span>
                            <span>Length: {item.measurements.shirtLength}</span>
                            <span>Neck: {item.measurements.neck}</span>
                          </div>
                        </div>
                      )}

                      {/* Quantity & Price */}
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                        <div className="flex items-center border border-border rounded-sm">
                          <button
                            onClick={() => updateQuantity(index, Math.max(1, item.quantity - 1))}
                            className="p-2 hover:bg-muted transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-4 py-2 border-x border-border min-w-[50px] text-center text-sm">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(index, item.quantity + 1)}
                            className="p-2 hover:bg-muted transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="font-medium">
                          ₹{((item.product.price + (item.customCharge || 0)) * item.quantity).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 border border-border rounded-sm p-6 space-y-4">
                <h2 className="text-xl mb-4">Order Summary</h2>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                  </div>
                  {subtotal < 2999 && (
                    <p className="text-xs text-muted-foreground">
                      Add ₹{(2999 - subtotal).toLocaleString('en-IN')} more for free delivery
                    </p>
                  )}
                  <div className="border-t border-border pt-3 flex justify-between font-medium">
                    <span>Total</span>
                    <span>₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <Link to="/checkout" className="block">
                  <Button size="lg" className="w-full mt-4">
                    Proceed to Checkout
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>

                <Link to="/shop" className="block">
                  <Button variant="outline" size="lg" className="w-full">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
