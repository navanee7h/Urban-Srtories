import { Link, useLocation } from 'react-router';
import { ShoppingCart, User, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { items } = useCart();
  const { user } = useAuth();
  const cartItemCount = items.length;

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="text-xl md:text-2xl tracking-tight">Urban Stories</h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`text-sm transition-colors hover:text-primary ${
                isActive('/') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/shop" 
              className={`text-sm transition-colors hover:text-primary ${
                isActive('/shop') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Shop
            </Link>
            <Link 
              to="/about" 
              className={`text-sm transition-colors hover:text-primary ${
                isActive('/about') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              About Us
            </Link>
          </nav>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            <Link 
              to={user ? "/account" : "/login"} 
              className="flex items-center gap-2 hover:text-primary transition-colors"
              aria-label="Account"
            >
              <User className="w-5 h-5" />
              {user && <span className="hidden sm:inline text-sm font-medium">{user.first_name || user.username}</span>}
            </Link>
            <Link 
              to="/cart" 
              className="relative hover:text-primary transition-colors"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
            
            {/* Mobile Menu Button */}
            <button
              className="md:hidden hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 space-y-4 border-t border-border">
            <Link 
              to="/" 
              className={`block py-2 text-sm transition-colors ${
                isActive('/') ? 'text-primary' : 'text-muted-foreground'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/shop" 
              className={`block py-2 text-sm transition-colors ${
                isActive('/shop') ? 'text-primary' : 'text-muted-foreground'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Shop
            </Link>
            <Link 
              to="/about" 
              className={`block py-2 text-sm transition-colors ${
                isActive('/about') ? 'text-primary' : 'text-muted-foreground'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              About Us
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
