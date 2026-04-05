import { NavLink, Outlet, useNavigate } from 'react-router';
import { LayoutDashboard, ShoppingBag, Store, LogOut } from 'lucide-react';

export default function AdminLayout() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-zinc-950">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-zinc-900 border-r border-border flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Store className="w-6 h-6 mr-3 text-primary" />
          <h2 className="text-lg font-semibold tracking-tight">Urban Admin</h2>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            <li>
              <NavLink 
                to="/admin" 
                end
                className={({ isActive }) => 
                  `flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`
                }
              >
                <LayoutDashboard className="w-4 h-4 mr-3" />
                Dashboard
              </NavLink>
            </li>
            {/* Add more links here later if needed (e.g. /admin/products, /admin/orders) */}
          </ul>
        </nav>

        <div className="p-4 border-t border-border">
          <button 
            onClick={() => {
              localStorage.removeItem('admin_access');
              localStorage.removeItem('admin_refresh');
              navigate('/');
            }}
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
          >
            <LogOut className="w-4 h-4 mr-3" />
            Logout Admin
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white dark:bg-zinc-900 border-b border-border flex items-center justify-between px-8 shadow-sm">
          <h1 className="text-lg font-medium">Dashboard Overview</h1>
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
              A
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
