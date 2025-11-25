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
  Plus,
  Moon,
  Sun
} from 'lucide-react';
import { useSellerAuth } from '../context/SellerAuthContext';
import { useTheme } from '../context/ThemeContext';

const SellerNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { seller, logout, isAuthenticated } = useSellerAuth();
  const { theme, toggleTheme } = useTheme();
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
    <nav className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 dark:from-purple-900 dark:via-indigo-900 dark:to-blue-900 text-white shadow-2xl backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/seller/dashboard" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-white dark:bg-dark-800 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110">
                <span className="text-purple-700 dark:text-purple-400 font-bold text-xl">D</span>
              </div>
              <span className="font-bold text-xl hidden sm:block bg-white/10 px-3 py-1 rounded-lg backdrop-blur-sm">
                Seller Portal
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    isActive(item.path)
                      ? 'bg-white/20 text-white shadow-lg scale-105'
                      : 'text-white/80 hover:bg-white/10 hover:text-white hover:scale-105'
                  }`}
                >
                  <item.icon size={18} className="mr-2" />
                  {item.label}
                </Link>
              ))}
              
              <Link
                to="/seller/products/new"
                className="flex items-center ml-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-xl text-sm font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Plus size={18} className="mr-1" />
                Add Product
              </Link>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="ml-2 p-2 rounded-xl text-white/80 hover:bg-white/10 hover:text-white transition-all duration-300 transform hover:scale-110"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun size={20} className="text-yellow-300" />
                ) : (
                  <Moon size={20} />
                )}
              </button>

              <div className="ml-4 flex items-center space-x-3 pl-4 border-l border-white/20">
                <span className="text-sm text-white/90 font-medium px-3 py-1 bg-white/10 rounded-lg backdrop-blur-sm">
                  {seller?.sellerName || seller?.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300 transform hover:scale-110"
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
                className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isAuthenticated && mobileMenuOpen && (
        <div className="md:hidden bg-purple-700/90 dark:bg-purple-900/90 backdrop-blur-xl border-t border-white/10 animate-slide-up">
          <div className="px-4 pt-2 pb-3 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center px-4 py-3 rounded-xl text-base font-semibold transition-all duration-300 ${
                  isActive(item.path)
                    ? 'bg-white/20 text-white shadow-lg'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <item.icon size={20} className="mr-3" />
                {item.label}
              </Link>
            ))}
            <Link
              to="/seller/products/new"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-xl text-base font-bold shadow-lg transition-all duration-300"
            >
              <Plus size={20} className="mr-3" />
              Add Product
            </Link>

            {/* Mobile Theme Toggle */}
            <button
              onClick={() => {
                toggleTheme();
                setMobileMenuOpen(false);
              }}
              className="flex items-center w-full px-4 py-3 text-white/80 hover:bg-white/10 hover:text-white rounded-xl text-base font-semibold transition-colors"
            >
              {theme === 'dark' ? (
                <>
                  <Sun size={20} className="mr-3 text-yellow-300" />
                  Light Mode
                </>
              ) : (
                <>
                  <Moon size={20} className="mr-3" />
                  Dark Mode
                </>
              )}
            </button>

            <button
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center px-4 py-3 text-white/80 hover:bg-white/10 hover:text-white rounded-xl text-base font-semibold transition-colors"
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
