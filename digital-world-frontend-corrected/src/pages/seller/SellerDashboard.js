import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  ShoppingBag, 
  DollarSign, 
  TrendingUp, 
  Plus,
  Eye,
  AlertCircle
} from 'lucide-react';
import { useSellerAuth } from '../../context/SellerAuthContext';
import { sellerAPI } from '../../services/api';
import Loading from '../../components/Loading';

const SellerDashboard = () => {
  const { seller } = useSellerAuth();
  const [products, setProducts] = useState([]);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [productsRes, reportRes] = await Promise.all([
        sellerAPI.getProducts(),
        sellerAPI.getReport().catch(() => null),
      ]);
      setProducts(productsRes.data || []);
      setReport(reportRes?.data || null);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  const stats = [
    {
      title: 'Total Products',
      value: products.length,
      icon: Package,
      color: 'bg-blue-500',
      link: '/seller/products',
    },
    {
      title: 'Total Orders',
      value: report?.totalOrders || 0,
      icon: ShoppingBag,
      color: 'bg-green-500',
      link: '/seller/orders',
    },
    {
      title: 'Total Earnings',
      value: `LKR ${report?.totalEarnings?.toLocaleString() || 0}`,
      icon: DollarSign,
      color: 'bg-yellow-500',
    },
    {
      title: 'Total Sales',
      value: report?.totalSales || 0,
      icon: TrendingUp,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-dark-950 dark:via-dark-900 dark:to-dark-800 py-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {seller?.sellerName || 'Seller'}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Here's what's happening with your store today.
          </p>
        </div>

        {/* Account Status Warning */}
        {seller?.accountStatus !== 'ACTIVE' && (
          <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl flex items-start animate-scale-in">
            <AlertCircle className="text-yellow-500 dark:text-yellow-400 mr-3 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="font-medium text-yellow-800 dark:text-yellow-300">Account Status: {seller?.accountStatus}</h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
                {!seller?.isEmailVerified
                  ? 'Please verify your email to activate your account.'
                  : 'Your account is pending approval. You can still add products.'}
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="card hover:-translate-y-1 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-xl shadow-lg`}>
                  <stat.icon className="text-white" size={24} />
                </div>
              </div>
              {stat.link && (
                <Link
                  to={stat.link}
                  className="mt-4 inline-flex items-center text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                >
                  View all
                  <Eye size={16} className="ml-1" />
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Products */}
          <div className="card animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Products</h2>
              <Link
                to="/seller/products/new"
                className="flex items-center text-sm bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1.5 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <Plus size={16} className="mr-1" />
                Add New
              </Link>
            </div>
            {products.length === 0 ? (
              <div className="text-center py-8">
                <Package className="mx-auto text-gray-400 mb-3" size={48} />
                <p className="text-gray-500">No products yet</p>
                <Link
                  to="/seller/products/new"
                  className="inline-flex items-center mt-3 text-purple-600 hover:text-purple-700 font-medium"
                >
                  <Plus size={18} className="mr-1" />
                  Add your first product
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {products.slice(0, 5).map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <img
                      src={product.images?.[0] || 'https://via.placeholder.com/50'}
                      alt={product.title}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="ml-3 flex-1">
                      <h4 className="font-medium text-gray-900 text-sm truncate">
                        {product.title}
                      </h4>
                      <p className="text-sm text-gray-500">
                        LKR {product.sellingPrice?.toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.quantity > 0
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {product.quantity > 0 ? `${product.quantity} in stock` : 'Out of stock'}
                    </span>
                  </div>
                ))}
                {products.length > 5 && (
                  <Link
                    to="/seller/products"
                    className="block text-center text-sm text-purple-600 hover:text-purple-700 pt-2"
                  >
                    View all {products.length} products
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Quick Stats / Info */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Business Information</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Business Name</label>
                <p className="text-gray-900">{seller?.businessDetails?.businessName || 'Not set'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-gray-900">{seller?.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Mobile</label>
                <p className="text-gray-900">{seller?.mobile || 'Not set'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">GSTIN</label>
                <p className="text-gray-900">{seller?.GSTIN || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Account Status</label>
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    seller?.accountStatus === 'ACTIVE'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {seller?.accountStatus}
                </span>
              </div>
              <Link
                to="/seller/profile"
                className="block w-full text-center mt-4 px-4 py-2 border-2 border-purple-600 dark:border-purple-500 text-purple-600 dark:text-purple-400 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors font-medium"
              >
                Update Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
