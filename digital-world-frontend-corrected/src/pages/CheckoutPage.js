import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, CreditCard, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../services/api';
import Loading from '../components/Loading';

const CheckoutPage = () => {
  const { cart, loading: cartLoading, fetchCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Address, 2: Payment, 3: Confirmation
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentUrl, setPaymentUrl] = useState('');

  const [address, setAddress] = useState({
    name: user?.fullName || '',
    street: '',
    locality: '',
    address: '',
    city: '',
    state: '',
    pinCode: '',
    mobile: user?.mobile || '',
    country: 'Sri Lanka',
  });

  const [paymentMethod, setPaymentMethod] = useState('RAZORPAY');

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  if (cartLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Loading text="Loading checkout..." />
      </div>
    );
  }

  const cartItems = cart?.cartItems ? Array.from(cart.cartItems) : [];

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleAddressChange = (field, value) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const validateAddress = () => {
    const required = ['name', 'street', 'city', 'state', 'pinCode', 'mobile'];
    for (const field of required) {
      if (!address[field].trim()) {
        setError(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }
    if (!/^\d{5,10}$/.test(address.pinCode)) {
      setError('Please enter a valid pin code');
      return false;
    }
    if (!/^\d{10}$/.test(address.mobile)) {
      setError('Please enter a valid 10-digit mobile number');
      return false;
    }
    return true;
  };

  const handleProceedToPayment = () => {
    setError('');
    if (validateAddress()) {
      setStep(2);
    }
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await orderAPI.create(address, paymentMethod);
      const { payment_link_url } = response.data;

      if (payment_link_url) {
        setPaymentUrl(payment_link_url);
        setStep(3);
        // Refresh cart after order creation
        await fetchCart();
      } else {
        setError('Failed to create payment link');
      }
    } catch (err) {
      console.error('Order creation failed:', err);
      setError(err.response?.data?.message || 'Failed to create order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300'
              }`}
            >
              1
            </div>
            <span className="ml-2 font-medium">Address</span>
          </div>
          <div className="w-20 h-1 mx-4 bg-gray-300">
            <div
              className={`h-full ${step >= 2 ? 'bg-blue-600' : ''}`}
              style={{ width: step >= 2 ? '100%' : '0%' }}
            ></div>
          </div>
          <div className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300'
              }`}
            >
              2
            </div>
            <span className="ml-2 font-medium">Payment</span>
          </div>
          <div className="w-20 h-1 mx-4 bg-gray-300">
            <div
              className={`h-full ${step >= 3 ? 'bg-blue-600' : ''}`}
              style={{ width: step >= 3 ? '100%' : '0%' }}
            ></div>
          </div>
          <div className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-300'
              }`}
            >
              3
            </div>
            <span className="ml-2 font-medium">Confirm</span>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Step 1: Shipping Address */}
            {step === 1 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center mb-6">
                  <MapPin className="text-blue-600 mr-2" size={24} />
                  <h2 className="text-xl font-semibold">Shipping Address</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={address.name}
                      onChange={(e) => handleAddressChange('name', e.target.value)}
                      className="input-field"
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      value={address.street}
                      onChange={(e) => handleAddressChange('street', e.target.value)}
                      className="input-field"
                      placeholder="123 Main Street"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Locality
                    </label>
                    <input
                      type="text"
                      value={address.locality}
                      onChange={(e) => handleAddressChange('locality', e.target.value)}
                      className="input-field"
                      placeholder="Neighborhood"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Additional Address
                    </label>
                    <input
                      type="text"
                      value={address.address}
                      onChange={(e) => handleAddressChange('address', e.target.value)}
                      className="input-field"
                      placeholder="Apt, Suite, etc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      value={address.city}
                      onChange={(e) => handleAddressChange('city', e.target.value)}
                      className="input-field"
                      placeholder="Colombo"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State/Province *
                    </label>
                    <input
                      type="text"
                      value={address.state}
                      onChange={(e) => handleAddressChange('state', e.target.value)}
                      className="input-field"
                      placeholder="Western Province"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pin Code *
                    </label>
                    <input
                      type="text"
                      value={address.pinCode}
                      onChange={(e) => handleAddressChange('pinCode', e.target.value)}
                      className="input-field"
                      placeholder="10001"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      value={address.mobile}
                      onChange={(e) => handleAddressChange('mobile', e.target.value)}
                      className="input-field"
                      placeholder="0771234567"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      value={address.country}
                      onChange={(e) => handleAddressChange('country', e.target.value)}
                      className="input-field"
                      placeholder="Sri Lanka"
                    />
                  </div>
                </div>

                <button
                  onClick={handleProceedToPayment}
                  className="w-full btn-primary mt-6 py-3"
                >
                  Continue to Payment
                </button>
              </div>
            )}

            {/* Step 2: Payment Method */}
            {step === 2 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center mb-6">
                  <CreditCard className="text-blue-600 mr-2" size={24} />
                  <h2 className="text-xl font-semibold">Payment Method</h2>
                </div>

                <div className="space-y-4">
                  <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      value="RAZORPAY"
                      checked={paymentMethod === 'RAZORPAY'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <div className="ml-3">
                      <span className="font-medium">Razorpay</span>
                      <p className="text-sm text-gray-500">
                        Pay using Credit/Debit Card, UPI, Net Banking
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      value="STRIPE"
                      checked={paymentMethod === 'STRIPE'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <div className="ml-3">
                      <span className="font-medium">Stripe</span>
                      <p className="text-sm text-gray-500">
                        Pay using International Cards
                      </p>
                    </div>
                  </label>
                </div>

                {/* Shipping Address Summary */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Shipping to:</h4>
                  <p className="text-sm text-gray-600">
                    {address.name}<br />
                    {address.street}, {address.locality}<br />
                    {address.city}, {address.state} - {address.pinCode}<br />
                    {address.country}<br />
                    Phone: {address.mobile}
                  </p>
                  <button
                    onClick={() => setStep(1)}
                    className="text-blue-600 text-sm font-medium mt-2"
                  >
                    Edit Address
                  </button>
                </div>

                <div className="flex space-x-4 mt-6">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 btn-secondary py-3"
                  >
                    Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="flex-1 btn-primary py-3"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                    ) : (
                      'Place Order'
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Order Confirmation */}
            {step === 3 && (
              <div className="bg-white rounded-xl shadow-md p-6 text-center">
                <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Order Created Successfully!
                </h2>
                <p className="text-gray-600 mb-6">
                  Your order has been created. Please complete the payment to confirm your order.
                </p>

                {paymentUrl && (
                  <a
                    href={paymentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block btn-primary py-3 px-8 text-lg mb-4"
                  >
                    Complete Payment
                  </a>
                )}

                <div className="text-sm text-gray-500">
                  <p>After completing payment, your order will be processed.</p>
                  <p className="mt-2">
                    You can track your order in the{' '}
                    <button
                      onClick={() => navigate('/orders')}
                      className="text-blue-600 font-medium"
                    >
                      Orders
                    </button>{' '}
                    section.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h3 className="text-xl font-semibold mb-4">Order Summary</h3>

              <div className="max-h-60 overflow-y-auto mb-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center py-2 border-b">
                    <img
                      src={
                        item.product?.images?.[0] ||
                        'https://via.placeholder.com/50x50?text=No+Image'
                      }
                      alt={item.product?.title}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium line-clamp-1">
                        {item.product?.title}
                      </p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-medium">
                      LKR {(item.sellingPrice * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>LKR {cart?.totalMrpPrice?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-LKR {cart?.discount?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery</span>
                  <span className="text-green-600">Free</span>
                </div>
              </div>

              <div className="border-t mt-4 pt-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>LKR {cart?.totalSellingPrice?.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
