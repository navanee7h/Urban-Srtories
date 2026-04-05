import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowLeft, Check } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Textarea } from '../components/ui/textarea';
import { useCart } from '../context/CartContext';
import { createOrder } from '../data/api';
import { useAuth } from '../context/AuthContext';

export default function Checkout() {
  const navigate = useNavigate();
  const { items: cartItems, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod'>('upi');
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: prev.name || `${user.first_name} ${user.last_name}`.trim() || user.username,
        email: prev.email || user.email,
        phone: prev.phone || (user.phone_number ? `${user.country_code || ''} ${user.phone_number}`.trim() : '')
      }));
    }
  }, [user]);

  const subtotal = cartItems.reduce((sum, item) => {
    const itemPrice = item.product.price + (item.customCharge || 0);
    return sum + (itemPrice * item.quantity);
  }, 0);
  const shipping = subtotal >= 2999 ? 0 : 200;
  const total = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    setSubmitting(true);
    try {
      await createOrder({
        items: cartItems.map((item) => ({
          product_id: item.product.id,
          size: item.size,
          fit: item.fit,
          quantity: item.quantity,
          custom_charge: item.customCharge,
          measurements: item.measurements as unknown as Record<string, string>,
        })),
        shipping_address: formData,
        payment_method: paymentMethod,
        total,
      });
      clearCart();
      alert('Order placed successfully!');
      navigate('/account');
    } catch {
      alert('Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4 px-4">
            <h2 className="text-2xl">Your cart is empty</h2>
            <p className="text-muted-foreground">Add items to your cart before checking out.</p>
            <Link to="/shop">
              <Button size="lg">Shop Collection</Button>
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
          <Link to="/cart" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cart
          </Link>

          <h1 className="text-3xl md:text-4xl mb-8">Checkout</h1>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Checkout Form */}
              <div className="lg:col-span-2 space-y-8">
                {/* Contact Information */}
                <div className="border border-border rounded-sm p-6">
                  <h2 className="text-xl mb-6">Contact Information</h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          required
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="+91 98765 43210"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="border border-border rounded-sm p-6">
                  <h2 className="text-xl mb-6">Shipping Address</h2>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="address">Address *</Label>
                      <Textarea
                        id="address"
                        required
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="Street address, apartment, suite, etc."
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          required
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          placeholder="City"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State *</Label>
                        <Input
                          id="state"
                          required
                          value={formData.state}
                          onChange={(e) => handleInputChange('state', e.target.value)}
                          placeholder="State"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pincode">Pincode *</Label>
                        <Input
                          id="pincode"
                          required
                          value={formData.pincode}
                          onChange={(e) => handleInputChange('pincode', e.target.value)}
                          placeholder="400001"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="border border-border rounded-sm p-6">
                  <h2 className="text-xl mb-6">Payment Method</h2>
                  <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as any)}>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-4 border border-border rounded-sm">
                        <RadioGroupItem value="upi" id="upi" />
                        <Label htmlFor="upi" className="flex-1 cursor-pointer font-normal">
                          <div>
                            <p className="font-medium">UPI</p>
                            <p className="text-sm text-muted-foreground">Pay using Google Pay, PhonePe, Paytm</p>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 border border-border rounded-sm">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="flex-1 cursor-pointer font-normal">
                          <div>
                            <p className="font-medium">Credit / Debit Card</p>
                            <p className="text-sm text-muted-foreground">Visa, Mastercard, American Express</p>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 border border-border rounded-sm">
                        <RadioGroupItem value="cod" id="cod" />
                        <Label htmlFor="cod" className="flex-1 cursor-pointer font-normal">
                          <div>
                            <p className="font-medium">Cash on Delivery</p>
                            <p className="text-sm text-muted-foreground">Pay when you receive the order</p>
                          </div>
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 border border-border rounded-sm p-6 space-y-4">
                  <h2 className="text-xl mb-4">Order Summary</h2>
                  
                  {/* Items */}
                  <div className="space-y-3 pb-4 border-b border-border">
                    {cartItems.map((item, index) => (
                      <div key={index}>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            {item.product.name} ({item.size}) × {item.quantity}
                          </span>
                          <span>₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</span>
                        </div>
                        {item.fit === 'Custom' && item.customCharge && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground pl-4">Custom Tailoring</span>
                            <span>₹{(item.customCharge * item.quantity).toLocaleString('en-IN')}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className={shipping === 0 ? 'text-green-600' : ''}>
                        {shipping === 0 ? 'FREE' : `₹${shipping}`}
                      </span>
                    </div>
                    <div className="border-t border-border pt-3 flex justify-between font-medium text-base">
                      <span>Total</span>
                      <span>₹{total.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <Button type="submit" size="lg" className="w-full mt-6" disabled={submitting}>
                    <Check className="mr-2 w-4 h-4" />
                    {submitting ? 'Placing Order...' : 'Place Order'}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center mt-4">
                    By placing this order, you agree to our Terms & Conditions
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
