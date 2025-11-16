import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, ShoppingBag, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';

const ProfilePage = () => {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Loading text="Loading profile..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center mb-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                  <User size={40} className="text-blue-600" />
                </div>
                <div className="ml-4">
                  <h2 className="text-2xl font-bold text-gray-900">{user?.fullName}</h2>
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mt-1">
                    {user?.role?.replace('ROLE_', '')}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <Mail className="text-gray-500 mr-3" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Email Address</p>
                    <p className="font-medium">{user?.email}</p>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <Phone className="text-gray-500 mr-3" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Mobile Number</p>
                    <p className="font-medium">{user?.mobile || 'Not provided'}</p>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <User className="text-gray-500 mr-3" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">User ID</p>
                    <p className="font-medium">#{user?.id}</p>
                  </div>
                </div>
              </div>

              {/* Addresses */}
              {user?.addresses && user.addresses.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Saved Addresses</h3>
                  <div className="space-y-3">
                    {Array.from(user.addresses).map((address, index) => (
                      <div key={address.id || index} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-start">
                          <MapPin className="text-gray-500 mr-2 flex-shrink-0 mt-1" size={16} />
                          <div>
                            <p className="font-medium">{address.name}</p>
                            <p className="text-sm text-gray-600">
                              {address.street}
                              {address.locality && `, ${address.locality}`}
                              <br />
                              {address.city}, {address.state} - {address.pinCode}
                              <br />
                              {address.country}
                              <br />
                              Phone: {address.mobile}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/orders')}
                  className="w-full flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <ShoppingBag className="text-blue-600 mr-3" size={20} />
                  <span className="font-medium">View Orders</span>
                </button>

                <button
                  onClick={() => navigate('/cart')}
                  className="w-full flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <ShoppingBag className="text-blue-600 mr-3" size={20} />
                  <span className="font-medium">View Cart</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors text-red-600"
                >
                  <LogOut className="mr-3" size={20} />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>

            {/* Account Info */}
            <div className="bg-white rounded-xl shadow-md p-6 mt-6">
              <h3 className="text-lg font-semibold mb-4">Account Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Account Type</span>
                  <span className="font-medium">{user?.role?.replace('ROLE_', '')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Coupons Used</span>
                  <span className="font-medium">{user?.usedCoupons?.length || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
