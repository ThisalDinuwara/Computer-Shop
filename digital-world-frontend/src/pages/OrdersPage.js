import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, ChevronRight, Calendar, MapPin } from 'lucide-react';
import { orderAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingOrder, setCancellingOrder] = useState(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    try {
      const response = await orderAPI.getHistory();
      setOrders(response.data || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    setCancellingOrder(orderId);
    try {
      await orderAPI.cancel(orderId);
      await fetchOrders();
    } catch (error) {
      console.error('Failed to cancel order:', error);
      alert('Failed to cancel order. Please try again.');
    } finally {
      setCancellingOrder(null);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      PLACED: 'bg-blue-100 text-blue-800',
      CONFIRMED: 'bg-indigo-100 text-indigo-800',
      SHIPPED: 'bg-purple-100 text-purple-800',
      DELIVERED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      PENDING: 'text-yellow-600',
      PROCESSING: 'text-blue-600',
      COMPLETED: 'text-green-600',
      FAILED: 'text-red-600',
    };
    return colors[status] || 'text-gray-600';
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Loading text="Loading orders..." />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package size={64} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Orders Yet</h2>
          <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
          <Link to="/products" className="btn-primary">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              {/* Order Header */}
              <div className="bg-gray-50 p-4 border-b">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-6">
                    <div>
                      <span className="text-sm text-gray-500">Order ID</span>
                      <p className="font-medium">{order.orderId || `#${order.id}`}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Order Date</span>
                      <p className="font-medium flex items-center">
                        <Calendar size={16} className="mr-1" />
                        {new Date(order.orderDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Total Amount</span>
                      <p className="font-semibold text-lg">
                        ₹{order.totalSellingPrice?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 flex items-center space-x-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        order.orderStatus
                      )}`}
                    >
                      {order.orderStatus}
                    </span>
                    <span
                      className={`text-sm font-medium ${getPaymentStatusColor(
                        order.paymentStatus
                      )}`}
                    >
                      Payment: {order.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-4">
                <div className="space-y-4">
                  {order.orderItems?.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between border-b pb-4 last:border-b-0 last:pb-0"
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={
                            item.product?.images?.[0] ||
                            'https://via.placeholder.com/80x80?text=No+Image'
                          }
                          alt={item.product?.title}
                          className="w-20 h-20 object-cover rounded-lg"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                          }}
                        />
                        <div>
                          <Link
                            to={`/product/${item.product?.id}`}
                            className="font-medium text-gray-900 hover:text-blue-600"
                          >
                            {item.product?.title}
                          </Link>
                          <div className="text-sm text-gray-500 mt-1">
                            {item.size && <span>Size: {item.size} | </span>}
                            <span>Qty: {item.quantity}</span>
                          </div>
                          <div className="text-sm mt-1">
                            <span className="font-medium">
                              ₹{item.sellingPrice?.toLocaleString()}
                            </span>
                            {item.mrpPrice > item.sellingPrice && (
                              <span className="ml-2 text-gray-500 line-through">
                                ₹{item.mrpPrice?.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              {order.shippingAddress && (
                <div className="bg-gray-50 p-4 border-t">
                  <div className="flex items-start">
                    <MapPin size={20} className="text-gray-500 mr-2 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-medium text-sm mb-1">Shipping Address</h4>
                      <p className="text-sm text-gray-600">
                        {order.shippingAddress.name}<br />
                        {order.shippingAddress.street}
                        {order.shippingAddress.locality &&
                          `, ${order.shippingAddress.locality}`}
                        <br />
                        {order.shippingAddress.city}, {order.shippingAddress.state} -{' '}
                        {order.shippingAddress.pinCode}
                        <br />
                        Phone: {order.shippingAddress.mobile}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Order Actions */}
              <div className="p-4 border-t flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  {order.deliverDate && order.orderStatus !== 'CANCELLED' && (
                    <span>
                      Expected Delivery:{' '}
                      {new Date(order.deliverDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  )}
                </div>
                <div className="flex space-x-3">
                  {order.orderStatus !== 'CANCELLED' &&
                    order.orderStatus !== 'DELIVERED' && (
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        disabled={cancellingOrder === order.id}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        {cancellingOrder === order.id ? 'Cancelling...' : 'Cancel Order'}
                      </button>
                    )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
