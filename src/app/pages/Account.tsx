import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { Package, Heart, User as UserIcon, Edit2, LogOut, Loader2, Check } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useAuth } from '../context/AuthContext';
import { fetchOrders } from '../data/api';
import type { Order } from '../data/products';

export default function Account() {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const { user, logout, loading, fetchProfile } = useAuth();
  
  // Measurements State
  const [measurements, setMeasurements] = useState({
    chest: '',
    shoulder: '',
    sleeveLength: '',
    shirtLength: '',
    neck: '',
  });
  const [savingMeasurements, setSavingMeasurements] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchOrders().then(setOrders).catch(console.error);
      if (user.measurements) {
        setMeasurements({
          chest: user.measurements.chest || '',
          shoulder: user.measurements.shoulder || '',
          sleeveLength: user.measurements.sleeveLength || '',
          shirtLength: user.measurements.shirtLength || '',
          neck: user.measurements.neck || '',
        });
      }
    }
  }, [user]);

  const handleSaveMeasurements = async () => {
    setSavingMeasurements(true);
    try {
      const res = await fetch('http://localhost:8000/api/auth/me/', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
           profile: { measurements }
        })
      });

      if (!res.ok) throw new Error('Failed to save measurements');
      
      await fetchProfile(); // refresh context
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (error) {
      console.error(error);
      alert('Failed to save measurements.');
    } finally {
      setSavingMeasurements(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-16 flex items-center justify-center">
          <div className="text-center max-w-md w-full bg-white dark:bg-zinc-950 p-8 border rounded-lg shadow-sm">
            <div className="w-16 h-16 rounded-full bg-muted text-muted-foreground flex items-center justify-center mx-auto mb-4">
              <UserIcon className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-medium mb-2">Sign in Required</h2>
            <p className="text-muted-foreground mb-6">Create an account or sign in to view your orders, saved measurements, and fast checkout.</p>
            <Link to="/login">
              <Button className="w-full">Sign In / Register</Button>
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
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl mb-2">My Account</h1>
            <p className="text-muted-foreground">Manage your orders, measurements, and wishlist</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                <span className="hidden sm:inline">Orders</span>
              </TabsTrigger>
              <TabsTrigger value="measurements" className="flex items-center gap-2">
                <Edit2 className="w-4 h-4" />
                <span className="hidden sm:inline">Measurements</span>
              </TabsTrigger>
              <TabsTrigger value="wishlist" className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                <span className="hidden sm:inline">Wishlist</span>
              </TabsTrigger>
            </TabsList>

            {/* Orders Tab */}
            <TabsContent value="orders" className="space-y-6">
              <div>
                <h2 className="text-2xl mb-6">Order History</h2>
                {orders.length === 0 ? (
                  <div className="text-center py-12 border border-border rounded-sm">
                    <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">No orders yet</p>
                    <Link to="/shop">
                      <Button>Start Shopping</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map(order => (
                      <div key={order.id} className="border border-border p-4 rounded-sm flex justify-between items-center bg-white dark:bg-zinc-950">
                        <div>
                          <p className="font-medium">Order #{order.id}</p>
                          <p className="text-sm text-muted-foreground">{new Date((order as any).created_at || order.date || 0).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-primary">₹{Number(order.total).toLocaleString('en-IN')}</p>
                          <div className="inline-flex mt-1 px-2 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                            {order.status}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Measurements Tab */}
            <TabsContent value="measurements" className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl">Saved Measurements</h2>
                  <Link to="/measurement-guide">
                    <Button variant="outline" size="sm">
                      View Guide
                    </Button>
                  </Link>
                </div>
                
                <div className="border border-border rounded-sm p-6 bg-white dark:bg-zinc-950">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Chest</label>
                      <input 
                        type="number" 
                        value={measurements.chest} 
                        onChange={e => setMeasurements({...measurements, chest: e.target.value})}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
                        placeholder="inches" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Shoulder</label>
                      <input 
                        type="number" 
                        value={measurements.shoulder} 
                        onChange={e => setMeasurements({...measurements, shoulder: e.target.value})}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
                        placeholder="inches" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Sleeve Length</label>
                      <input 
                        type="number" 
                        value={measurements.sleeveLength} 
                        onChange={e => setMeasurements({...measurements, sleeveLength: e.target.value})}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
                        placeholder="inches" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Shirt Length</label>
                      <input 
                        type="number" 
                        value={measurements.shirtLength} 
                        onChange={e => setMeasurements({...measurements, shirtLength: e.target.value})}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
                        placeholder="inches" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Neck</label>
                      <input 
                        type="number" 
                        value={measurements.neck} 
                        onChange={e => setMeasurements({...measurements, neck: e.target.value})}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
                        placeholder="inches" 
                      />
                    </div>
                  </div>
                  
                  <div className="mt-8 flex justify-end">
                    <Button onClick={handleSaveMeasurements} disabled={savingMeasurements} className="w-full md:w-auto">
                      {savingMeasurements ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                      {savedSuccess && !savingMeasurements ? <Check className="w-4 h-4 mr-2" /> : null}
                      {savedSuccess ? 'Saved!' : 'Save Measurements'}
                    </Button>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-muted rounded-sm">
                  <p className="text-sm text-muted-foreground">
                    Your saved measurements will be automatically used when you select "Custom Tailoring" for any product.
                  </p>
                </div>
              </div>
            </TabsContent>

            {/* Wishlist Tab */}
            <TabsContent value="wishlist" className="space-y-6">
              <div>
                <h2 className="text-2xl mb-6">My Wishlist</h2>
                <div className="text-center py-12 border border-border rounded-sm">
                  <Heart className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">Your wishlist is empty</p>
                  <Link to="/shop">
                    <Button>Browse Products</Button>
                  </Link>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Profile Section */}
          <div className="mt-12 pt-8 border-t border-border">
            <h2 className="text-2xl mb-6">Profile Information</h2>
            <div className="border border-border rounded-sm p-6 bg-white dark:bg-zinc-950 flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center gap-4 mb-4 md:mb-0">
                <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <UserIcon className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-medium">{user.first_name || user.username} {user.last_name}</h3>
                  <p className="text-muted-foreground">{user.email}</p>
                </div>
              </div>
              
              <div className="flex flex-col gap-3 w-full md:w-auto">
                {user.is_staff && (
                  <Link to="/admin">
                    <Button variant="default" className="w-full md:w-auto">Admin Dashboard</Button>
                  </Link>
                )}
                <Button variant="outline" className="w-full md:w-auto text-red-600 hover:text-red-700 hover:bg-red-50" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
