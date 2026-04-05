import { useState, useEffect } from 'react';
import { Outlet } from 'react-router';
import { Loader2 } from 'lucide-react';
import AdminLogin from '../pages/admin/AdminLogin';

export default function AdminRoute() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAdmin = async () => {
      const token = localStorage.getItem('admin_access');
      if (!token) {
        setIsAdmin(false);
        return;
      }
      try {
        const res = await fetch('http://localhost:8000/api/auth/me/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setIsAdmin(data.is_staff);
        } else {
          setIsAdmin(false);
        }
      } catch {
        setIsAdmin(false);
      }
    };
    checkAdmin();
  }, []);

  if (isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return <AdminLogin />;
  }

  return <Outlet />;
}
