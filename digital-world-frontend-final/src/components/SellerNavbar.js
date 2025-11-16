import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Package, 
  ShoppingBag, 
  BarChart3, 
  User, 
  LogOut, 
  Menu, 
  X,
  Plus
} from 'lucide-react';
import { useSellerAuth } from '../context/SellerAuthContext';

const SellerNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { seller, logout, isAuthenticated } = useSellerAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/seller/login');
  };

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/seller/dashboard', icon: BarChart3, label: 'Dashboard' },
    { path: '/seller/products', icon: Package, label: 'Products' },
    { path: '/seller/orders', icon: ShoppingBag, label: 'Orders' },
    { path: '/seller/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="bg-gradient-to-r from-purple-700 to-indigo-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/seller/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-purple-700 font-bold text-lg">D</span>
              </div>
              <span className="font-bold text-xl">Seller Portal</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'bg-white/20 text-white'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <item.icon size={18} className="mr-2" />
                  {item.label}
                </Link>
              ))}
              
              <Link
                to="/seller/products/new"
                className="flex items-center ml-2 px-4 py-2 bg-green-500 hover:bg-green-600 rounded-md text-sm font-medium transition-colors"
              >
                <Plus size={18} className="mr-1" />
                Add Product
              </Link>

              <div className="ml-4 flex items-center space-x-3">
                <span className="text-sm text-white/80">
                  {seller?.sellerName || seller?.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-white/80 hover:text-white transition-colors"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </div>
          )}

          {/* Mobile Menu Button */}
          {isAuthenticated && (
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-white"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isAuthenticated && mobileMenuOpen && (
        <div className="md:hidden bg-purple-800">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                  isActive(item.path)
                    ? 'bg-white/20 text-white'
                    : 'text-white/80 hover:bg-white/10'
                }`}
              >
                <item.icon size={20} className="mr-3" />
                {item.label}
              </Link>
            ))}
            <Link
              to="/seller/products/new"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center px-3 py-2 bg-green-500 hover:bg-green-600 rounded-md text-base font-medium"
            >
              <Plus size={20} className="mr-3" />
              Add Product
            </Link>
            <button
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center px-3 py-2 text-white/80 hover:bg-white/10 rounded-md text-base font-medium"
            >
              <LogOut size={20} className="mr-3" />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default SellerNavbar;
