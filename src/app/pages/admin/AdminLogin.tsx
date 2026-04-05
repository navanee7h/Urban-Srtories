import { useState } from 'react';
import { ShieldAlert, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:8000/api/auth/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.detail || 'Invalid credentials');
      }

      const meRes = await fetch('http://localhost:8000/api/auth/me/', {
        headers: { 'Authorization': `Bearer ${data.access}` }
      });
      
      const meData = await meRes.json();
      if (!meRes.ok) throw new Error('Failed to verify permissions');
      
      if (!meData.is_staff) {
         throw new Error('Unauthorized. You do not have staff permissions.');
      }

      localStorage.setItem('admin_access', data.access);
      localStorage.setItem('admin_refresh', data.refresh);
      window.location.reload();
    } catch (err: any) {
      setError(err.message || 'Login failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-muted/20">
      <div className="w-full max-w-md bg-white dark:bg-zinc-950 p-8 border rounded-lg shadow-sm">
        <div className="text-center mb-8">
          <ShieldAlert className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-semibold tracking-tight mb-2">Admin Portal</h1>
          <p className="text-muted-foreground">Restricted access area.</p>
        </div>
        
        <div>
          {error && (
            <div className="mb-6 p-3 text-sm text-red-600 bg-red-100 rounded-md text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-username">Username</Label>
              <Input
                id="admin-username"
                value={username}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="admin-password">Password</Label>
              </div>
              <Input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" size="lg" className="w-full mt-8 gap-2" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Authenticating...' : 'Access Dashboard'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
