import { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus, Package, Loader2, DollarSign, ShoppingCart, AlertCircle, Download, FileText } from 'lucide-react';
import { fetchProducts, fetchOrders, createProduct, updateProduct, deleteProduct } from '../../data/api';
import type { Product, Order } from '../../data/products';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DEFAULT_PRODUCT: Omit<Product, 'id'> = {
  name: '',
  price: 0,
  image: '',
  color: '',
  description: '',
  sizes: { 'S': 10, 'M': 10, 'L': 10, 'XL': 10 } as Record<string, number>,
  fit: 'Regular',
  fabric: '100% Premium Linen',
  category: 'Shirts',
};

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Omit<Product, 'id'>>(DEFAULT_PRODUCT);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [productsData, ordersData] = await Promise.all([
        fetchProducts(),
        fetchOrders(true)
      ]);
      setProducts(productsData);
      setOrders(ordersData);
    } catch (error) {
      console.error('Failed to load admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      // Exclude id and image_file (string URL) from formData
      // image_file is handled by the File input state
      const { id, image_file, ...rest } = product;
      setFormData(rest as Omit<Product, 'id'>);
    } else {
      setEditingProduct(null);
      setFormData(DEFAULT_PRODUCT);
    }
    setImageFile(null);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let payload: any = formData;
      if (imageFile) {
        payload = new FormData();
        Object.keys(formData).forEach(key => {
          const val = formData[key as keyof typeof formData];
          if (key === 'sizes' && typeof val === 'object' && val !== null) {
            payload.append(key, JSON.stringify(val));
          } else {
            payload.append(key, String(val));
          }
        });
        payload.append('image_file', imageFile);
      }

      if (editingProduct) {
        const updated = await updateProduct(editingProduct.id, payload);
        setProducts(products.map(p => p.id === updated.id ? updated : p));
      } else {
        const created = await createProduct(payload);
        setProducts([...products, created]);
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  const handleChange = (field: keyof Omit<Product, 'id'>, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleExportCSV = () => {
    const csvRows = [];
    csvRows.push(['Order ID', 'Date', 'Customer', 'Status', 'Items Count', 'Total (INR)'].join(','));
    orders.forEach(order => {
      const date = new Date((order as any).created_at || order.date || Date.now()).toLocaleDateString();
      const customer = `"${(order as any).shipping_name || 'Guest User'}"`;
      const itemsCount = order.items?.length || 0;
      csvRows.push([order.id, date, customer, order.status, itemsCount, order.total].join(','));
    });
    const csvData = csvRows.join('\n');
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `urban_stories_orders_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Derived Metrics
  const totalRevenue = orders.reduce((acc, order) => acc + Number(order.total), 0);
  const lowStockCount = products.filter(p => Object.values(p.sizes || {}).some(qty => Number(qty) < 5)).length;
  
  const recentOrders = [...orders]
    .sort((a, b) => new Date((b as any).created_at || b.date || 0).getTime() - new Date((a as any).created_at || a.date || 0).getTime())
    .slice(0, 5);

  const revenueByDate = orders.reduce((acc: Record<string, number>, order) => {
    const dateStr = new Date((order as any).created_at || order.date || Date.now()).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' });
    acc[dateStr] = (acc[dateStr] || 0) + Number(order.total);
    return acc;
  }, {});
  
  const chartData = Object.entries(revenueByDate).map(([dateStr, revenue]) => ({ date: dateStr, revenue }));

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Products & Orders</h2>
          <p className="text-muted-foreground mt-1">Manage inventory and monitor sales.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Product Name</Label>
                  <Input required value={formData.name} onChange={e => handleChange('name', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Price (₹)</Label>
                  <Input type="number" required min="0" step="1" value={formData.price} onChange={e => handleChange('price', parseFloat(e.target.value))} />
                </div>
                <div className="space-y-2">
                  <Label>Image URL (or upload below)</Label>
                  <Input value={formData.image} onChange={e => handleChange('image', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Upload Image File</Label>
                  <Input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} />
                </div>
                <div className="space-y-2">
                  <Label>Color</Label>
                  <Input required value={formData.color} onChange={e => handleChange('color', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Fabric</Label>
                  <Input required value={formData.fabric} onChange={e => handleChange('fabric', e.target.value)} />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea required rows={3} value={formData.description} onChange={e => handleChange('description', e.target.value)} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Fit Type</Label>
                  <Input required placeholder="e.g. Slim, Regular, Relaxed" value={formData.fit} onChange={e => handleChange('fit', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Input required value={formData.category} onChange={e => handleChange('category', e.target.value)} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Size Quantities</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['S', 'M', 'L', 'XL'].map((size) => (
                    <div key={size} className="flex items-center space-x-2 bg-muted/50 p-2 rounded-md">
                      <Label className="w-8 shrink-0 font-medium text-center">{size}</Label>
                      <Input 
                        type="number" 
                        min="0" 
                        step="1" 
                        className="h-8 w-full px-2"
                        value={formData.sizes?.[size] ?? 0} 
                        onChange={e => {
                          const num = parseInt(e.target.value) || 0;
                          setFormData(prev => ({
                            ...prev,
                            sizes: { ...prev.sizes, [size]: num }
                          }));
                        }} 
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Product'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 md:max-w-[400px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products ({products.length})</TabsTrigger>
          <TabsTrigger value="orders">Orders ({orders.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-zinc-950 p-6 border rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-muted-foreground">Total Revenue</h3>
                <DollarSign className="w-4 h-4 text-primary opacity-70" />
              </div>
              <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString('en-IN')}</div>
            </div>
            
            <div className="bg-white dark:bg-zinc-950 p-6 border rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-muted-foreground">Total Orders</h3>
                <ShoppingCart className="w-4 h-4 text-primary opacity-70" />
              </div>
              <div className="text-2xl font-bold">{orders.length}</div>
            </div>
            
            <div className="bg-white dark:bg-zinc-950 p-6 border rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-muted-foreground">Active Products</h3>
                <Package className="w-4 h-4 text-primary opacity-70" />
              </div>
              <div className="text-2xl font-bold">{products.length}</div>
            </div>

            <div className="bg-white dark:bg-zinc-950 p-6 border rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-muted-foreground">Low Stock Alerts</h3>
                <AlertCircle className="w-4 h-4 text-red-500 opacity-70" />
              </div>
              <div className="text-2xl font-bold text-red-600">{lowStockCount}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-zinc-950 p-6 border rounded-lg shadow-sm">
              <h3 className="text-lg font-medium mb-4">Revenue Overview</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="date" tickLine={false} axisLine={false} />
                    <YAxis tickFormatter={(val) => `₹${val}`} tickLine={false} axisLine={false} />
                    <Tooltip cursor={{fill: 'transparent'}} formatter={(val) => `₹${Number(val).toLocaleString('en-IN')}`} />
                    <Bar dataKey="revenue" fill="currentColor" className="fill-primary" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-950 border rounded-lg shadow-sm flex flex-col">
              <div className="p-6 border-b flex justify-between items-center">
                <h3 className="text-lg font-medium">Recent Activity</h3>
                <span className="text-sm text-muted-foreground">Latest 5 Orders</span>
              </div>
              <div className="p-0 overflow-y-auto flex-1">
                {recentOrders.length === 0 ? (
                  <div className="p-6 flex flex-col items-center justify-center text-muted-foreground h-full">
                    <FileText className="w-8 h-8 mb-2 opacity-20" />
                    <p>No recent orders</p>
                  </div>
                ) : (
                  <Table>
                    <TableBody>
                      {recentOrders.map(order => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">#{order.id}</TableCell>
                          <TableCell>{(order as any).shipping_name || 'Guest User'}</TableCell>
                          <TableCell className="text-right font-medium text-primary">₹{Number(order.total).toLocaleString('en-IN')}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="products" className="bg-white dark:bg-zinc-950 border rounded-lg shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Color/Fit</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No products found. Add one to get started.
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="w-12 h-12 rounded-sm overflow-hidden bg-muted">
                        <img src={product.image_file || product.image} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>₹{product.price.toLocaleString('en-IN')}</TableCell>
                    <TableCell>
                      {(() => {
                        const totalStock = Object.values(product.sizes || {}).reduce((a, b) => a + (Number(b) || 0), 0);
                        return (
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            totalStock > 10 ? 'bg-green-100/50 text-green-700 dark:text-green-400' : 
                            totalStock > 0 ? 'bg-yellow-100/50 text-yellow-700 dark:text-yellow-400' : 'bg-red-100/50 text-red-700 dark:text-red-400'
                          }`}>
                            {totalStock} units
                          </span>
                        );
                      })()}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{product.color} / {product.fit}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(product)}>
                          <Pencil className="w-4 h-4 text-primary" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="orders" className="bg-white dark:bg-zinc-950 border rounded-lg shadow-sm">
          <div className="p-4 flex justify-between items-center border-b">
            <h3 className="font-medium">All Orders</h3>
            <Button variant="outline" size="sm" onClick={handleExportCSV} className="gap-2">
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Items</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    No orders have been placed yet.
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">#{order.id}</TableCell>
                    <TableCell>{new Date((order as any).created_at || order.date || Date.now()).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{(order as any).shipping_name || 'Guest User'}</p>
                        <p className="text-xs text-muted-foreground">{(order as any).shipping_city || 'City'}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'Processing' ? 'bg-blue-100/50 text-blue-700 dark:text-blue-400' :
                        order.status === 'Delivered' ? 'bg-green-100/50 text-green-700 dark:text-green-400' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {order.status}
                      </span>
                    </TableCell>
                    <TableCell>{order.items?.length || 0} items</TableCell>
                    <TableCell className="text-right font-medium">₹{Number(order.total).toLocaleString('en-IN')}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  );
}
