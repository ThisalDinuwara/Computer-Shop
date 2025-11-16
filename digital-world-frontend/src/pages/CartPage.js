import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';

const CartPage = () => {
  const { cart, loading, updateCartItem, removeFromCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [updatingItem, setUpdatingItem] = useState(null);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag size={64} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Please Login</h2>
          <p className="text-gray-600 mb-6">You need to login to view your cart.</p>
          <Link to="/login" className="btn-primary">
            Login Now
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Loading text="Loading cart..." />
      </div>
    );
  }

  const cartItems = cart?.cartItems ? Array.from(cart.cartItems) : [];

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    setUpdatingItem(itemId);
    try {
      await updateCartItem(itemId, newQuantity);
    } catch (error) {
      console.error('Failed to update quantity:', error);
    } finally {
      setUpdatingItem(null);
    }
  };

  const handleRemoveItem = async (itemId) => {
    setUpdatingItem(itemId);
    try {
      await removeFromCart(itemId);
    } catch (error) {
      console.error('Failed to remove item:', error);
    } finally {
      setUpdatingItem(null);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag size={64} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-6">Looks like you haven't added anything to your cart yet.</p>
          <Link to="/products" className="btn-primary">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-md p-6 flex flex-col sm:flex-row gap-4"
              >
                {/* Product Image */}
                <div className="flex-shrink-0">
                  <img
                    src={
                      item.product?.images?.[0] ||
                      'https://via.placeholder.com/150x150?text=No+Image'
                    }
                    alt={item.product?.title}
                    className="w-32 h-32 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/150x150?text=No+Image';
                    }}
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1">
                  <Link
                    to={`/product/${item.product?.id}`}
                    className="text-lg font-semibold text-gray-900 hover:text-blue-600"
                  >
                    {item.product?.title}
                  </Link>

                  {item.size && (
                    <p className="text-sm text-gray-500 mt-1">Size: {item.size}</p>
                  )}

                  <div className="flex items-center mt-2">
                    <span className="text-xl font-bold text-gray-900">
                      ₹{item.sellingPrice?.toLocaleString()}
                    </span>
                    {item.mrpPrice > item.sellingPrice && (
                      <span className="ml-2 text-sm text-gray-500 line-through">
                        ₹{item.mrpPrice?.toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        disabled={updatingItem === item.id || item.quantity <= 1}
                        className="w-8 h-8 border rounded-md flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-12 text-center font-medium">
                        {updatingItem === item.id ? (
                          <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                        ) : (
                          item.quantity
                        )}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        disabled={updatingItem === item.id}
                        className="w-8 h-8 border rounded-md flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={updatingItem === item.id}
                      className="text-red-600 hover:text-red-700 flex items-center"
                    >
                      <Trash2 size={18} className="mr-1" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h3 className="text-xl font-semibold mb-4">Order Summary</h3>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cart?.totalItem || 0} items)</span>
                  <span>₹{cart?.totalMrpPrice?.toLocaleString() || 0}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-₹{cart?.discount?.toLocaleString() || 0}</span>
                </div>
                {cart?.couponPrice > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Coupon Discount</span>
                    <span>-₹{cart?.couponPrice?.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span className="text-green-600">Free</span>
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>₹{cart?.totalSellingPrice?.toLocaleString() || 0}</span>
                </div>
                {cart?.discount > 0 && (
                  <p className="text-sm text-green-600 mt-1">
                    You're saving ₹{cart?.discount?.toLocaleString()}!
                  </p>
                )}
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full btn-primary flex items-center justify-center py-3"
              >
                Proceed to Checkout
                <ArrowRight className="ml-2" size={20} />
              </button>

              <Link
                to="/products"
                className="block text-center mt-4 text-blue-600 hover:text-blue-700 font-medium"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
