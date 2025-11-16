import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { SellerAuthProvider } from './context/SellerAuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import SellerProtectedRoute from './components/SellerProtectedRoute';
import SellerLayout from './layouts/SellerLayout';

// Customer Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import ProfilePage from './pages/ProfilePage';

// Seller Pages
import SellerLoginPage from './pages/seller/SellerLoginPage';
import SellerDashboard from './pages/seller/SellerDashboard';
import SellerProductsPage from './pages/seller/SellerProductsPage';
import AddEditProductPage from './pages/seller/AddEditProductPage';
import SellerOrdersPage from './pages/seller/SellerOrdersPage';
import SellerProfilePage from './pages/seller/SellerProfilePage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <SellerAuthProvider>
            <Routes>
              {/* Customer Routes */}
              <Route
                path="/*"
                element={
                  <div className="flex flex-col min-h-screen">
                    <Navbar />
                    <main className="flex-grow">
                      <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/products" element={<ProductsPage />} />
                        <Route path="/product/:id" element={<ProductDetailPage />} />
                        <Route
                          path="/cart"
                          element={
                            <ProtectedRoute>
                              <CartPage />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/checkout"
                          element={
                            <ProtectedRoute>
                              <CheckoutPage />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/orders"
                          element={
                            <ProtectedRoute>
                              <OrdersPage />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/profile"
                          element={
                            <ProtectedRoute>
                              <ProfilePage />
                            </ProtectedRoute>
                          }
                        />
                      </Routes>
                    </main>
                    <Footer />
                  </div>
                }
              />

              {/* Seller Routes */}
              <Route path="/seller/login" element={<SellerLoginPage />} />
              <Route
                path="/seller/*"
                element={
                  <SellerLayout>
                    <Routes>
                      <Route
                        path="/dashboard"
                        element={
                          <SellerProtectedRoute>
                            <SellerDashboard />
                          </SellerProtectedRoute>
                        }
                      />
                      <Route
                        path="/products"
                        element={
                          <SellerProtectedRoute>
                            <SellerProductsPage />
                          </SellerProtectedRoute>
                        }
                      />
                      <Route
                        path="/products/new"
                        element={
                          <SellerProtectedRoute>
                            <AddEditProductPage />
                          </SellerProtectedRoute>
                        }
                      />
                      <Route
                        path="/products/edit/:productId"
                        element={
                          <SellerProtectedRoute>
                            <AddEditProductPage />
                          </SellerProtectedRoute>
                        }
                      />
                      <Route
                        path="/orders"
                        element={
                          <SellerProtectedRoute>
                            <SellerOrdersPage />
                          </SellerProtectedRoute>
                        }
                      />
                      <Route
                        path="/profile"
                        element={
                          <SellerProtectedRoute>
                            <SellerProfilePage />
                          </SellerProtectedRoute>
                        }
                      />
                    </Routes>
                  </SellerLayout>
                }
              />
            </Routes>
          </SellerAuthProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
