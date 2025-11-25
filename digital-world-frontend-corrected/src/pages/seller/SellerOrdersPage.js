import React, { useState, useEffect } from 'react';
import { ShoppingBag, Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { sellerAPI } from '../../services/api';
import Loading from '../../components/Loading';

const SellerOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await sellerAPI.getOrders();
      setOrders(response.data || []);
    } catch (err) {
      // API might not be implemented yet
      setOrders([]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return <Clock className="text-yellow-500" size={20} />;
      case 'CONFIRMED':
        return <Package className="text-blue-500" size={20} />;
      case 'SHIPPED':
        return <Truck className="text-purple-500" size={20} />;
      case 'DELIVERED':
        return <CheckCircle className="text-green-500" size={20} />;
      default:
        return <ShoppingBag className="text-gray-500" size={20} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800';
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.orderStatus?.toUpperCase() === filter.toUpperCase());

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600 mt-1">
            Manage and track your customer orders ({orders.length} total)
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {error}
          </div>
        )}

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {['all', 'PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === status
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status === 'all' ? 'All Orders' : status}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <ShoppingBag className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-500">
              {filter === 'all'
                ? 'You haven\'t received any orders yet. Orders will appear here once customers start purchasing your products.'
                : `No ${filter.toLowerCase()} orders found.`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                  <div>
                    <div className="flex items-center">
                      {getStatusIcon(order.orderStatus)}
                      <h3 className="ml-2 text-lg font-semibold text-gray-900">
                        Order #{order.id}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Placed on {new Date(order.orderDate || order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="mt-4 lg:mt-0 flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                    <span className="text-lg font-bold text-gray-900">
                      LKR {order.totalPrice?.toLocaleString() || order.totalSellingPrice?.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                {order.orderItems && order.orderItems.length > 0 && (
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Order Items:</h4>
                    <div className="space-y-3">
                      {order.orderItems.map((item, index) => (
                        <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <img
                            src={item.product?.images?.[0] || 'https://via.placeholder.com/50'}
                            alt={item.product?.title}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="ml-4 flex-1">
                            <p className="font-medium text-gray-900">{item.product?.title}</p>
                            <p className="text-sm text-gray-500">
                              Qty: {item.quantity} × LKR {item.sellingPrice?.toLocaleString()}
                            </p>
                          </div>
                          <p className="font-medium text-gray-900">
                            LKR {(item.quantity * item.sellingPrice)?.toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Shipping Address */}
                {order.shippingAddress && (
                  <div className="border-t mt-4 pt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Shipping Address:</h4>
                    <p className="text-sm text-gray-600">
                      {order.shippingAddress.name}<br />
                      {order.shippingAddress.address}<br />
                      {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pinCode}<br />
                      Phone: {order.shippingAddress.mobile}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerOrdersPage;
