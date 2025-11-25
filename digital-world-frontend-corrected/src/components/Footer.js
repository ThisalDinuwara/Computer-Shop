import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white/80 dark:bg-dark-900/80 backdrop-blur-xl border-t border-gray-200 dark:border-dark-700 text-gray-700 dark:text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-3 mb-4 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110">
                <span className="text-white font-bold text-xl">D</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                Digital World
              </span>
            </div>
            <p className="text-sm mb-4 text-gray-600 dark:text-gray-400">
              Your one-stop destination for all digital products. Quality, affordability, and service excellence.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 rounded-lg bg-blue-100 dark:bg-dark-800 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-dark-700 transition-all duration-300 transform hover:scale-110">
                <Facebook size={20} />
              </a>
              <a href="#" className="p-2 rounded-lg bg-blue-100 dark:bg-dark-800 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-dark-700 transition-all duration-300 transform hover:scale-110">
                <Twitter size={20} />
              </a>
              <a href="#" className="p-2 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-110">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gray-900 dark:text-white font-bold mb-4 text-lg">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm flex items-center group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm flex items-center group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                  Products
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm flex items-center group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                  Cart
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm flex items-center group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                  My Orders
                </Link>
              </li>
              <li>
                <Link to="/seller/login" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors text-sm font-semibold flex items-center group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                  Become a Seller
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-gray-900 dark:text-white font-bold mb-4 text-lg">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm flex items-center group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm flex items-center group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm flex items-center group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm flex items-center group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                  Returns & Refunds
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-gray-900 dark:text-white font-bold mb-4 text-lg">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3 group">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-dark-800 text-blue-600 dark:text-blue-400 group-hover:bg-blue-200 dark:group-hover:bg-dark-700 transition-colors">
                  <MapPin size={16} />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">123 Digital Street, Tech City</span>
              </li>
              <li className="flex items-center space-x-3 group">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-dark-800 text-blue-600 dark:text-blue-400 group-hover:bg-blue-200 dark:group-hover:bg-dark-700 transition-colors">
                  <Phone size={16} />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">+94 11 234 5678</span>
              </li>
              <li className="flex items-center space-x-3 group">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-dark-800 text-blue-600 dark:text-blue-400 group-hover:bg-blue-200 dark:group-hover:bg-dark-700 transition-colors">
                  <Mail size={16} />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">support@digitalworld.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-dark-700 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} All rights reserved. Made with <span className="text-red-500">DinuwaraTechnologies</span> for the Digital World Computers.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
