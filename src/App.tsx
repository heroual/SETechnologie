import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import { ProductProvider } from './contexts/ProductContext';
import { ServiceProvider } from './contexts/ServiceContext';

// Lazy load non-critical pages
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Services = lazy(() => import('./pages/Services'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const QuoteRequest = lazy(() => import('./pages/QuoteRequest'));
const Login = lazy(() => import('./pages/Login'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation'));

// Admin pages
const AdminLayout = lazy(() => import('./components/admin/Layout'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminProducts = lazy(() => import('./pages/admin/Products'));
const AdminServices = lazy(() => import('./pages/admin/Services'));
const AdminUsers = lazy(() => import('./pages/admin/Users'));
const AdminReports = lazy(() => import('./pages/admin/Reports'));
const AdminOrders = lazy(() => import('./pages/admin/Orders'));
const AdminEmailSettings = lazy(() => import('./pages/admin/EmailSettings'));
const AdminShopSettings = lazy(() => import('./pages/admin/ShopSettings'));
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute'));

// Loading component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary)]"></div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <ServiceProvider>
          <CartProvider>
            <Router>
              <div className="min-h-screen bg-[var(--background)] flex flex-col">
                <Routes>
                  {/* Public Routes */}
                  <Route
                    path="/"
                    element={
                      <>
                        <Navbar />
                        <main className="flex-grow">
                          <Home />
                        </main>
                        <Footer />
                      </>
                    }
                  />
                  <Route
                    path="/products"
                    element={
                      <>
                        <Navbar />
                        <main className="flex-grow">
                          <Suspense fallback={<LoadingFallback />}>
                            <Products />
                          </Suspense>
                        </main>
                        <Footer />
                      </>
                    }
                  />
                  <Route
                    path="/products/:id"
                    element={
                      <>
                        <Navbar />
                        <main className="flex-grow">
                          <Suspense fallback={<LoadingFallback />}>
                            <ProductDetail />
                          </Suspense>
                        </main>
                        <Footer />
                      </>
                    }
                  />
                  <Route
                    path="/services"
                    element={
                      <>
                        <Navbar />
                        <main className="flex-grow">
                          <Suspense fallback={<LoadingFallback />}>
                            <Services />
                          </Suspense>
                        </main>
                        <Footer />
                      </>
                    }
                  />
                  <Route
                    path="/about"
                    element={
                      <>
                        <Navbar />
                        <main className="flex-grow">
                          <Suspense fallback={<LoadingFallback />}>
                            <About />
                          </Suspense>
                        </main>
                        <Footer />
                      </>
                    }
                  />
                  <Route
                    path="/contact"
                    element={
                      <>
                        <Navbar />
                        <main className="flex-grow">
                          <Suspense fallback={<LoadingFallback />}>
                            <Contact />
                          </Suspense>
                        </main>
                        <Footer />
                      </>
                    }
                  />
                  <Route
                    path="/quote-request"
                    element={
                      <>
                        <Navbar />
                        <main className="flex-grow">
                          <Suspense fallback={<LoadingFallback />}>
                            <QuoteRequest />
                          </Suspense>
                        </main>
                        <Footer />
                      </>
                    }
                  />
                  <Route
                    path="/cart"
                    element={
                      <>
                        <Navbar />
                        <main className="flex-grow">
                          <Suspense fallback={<LoadingFallback />}>
                            <Cart />
                          </Suspense>
                        </main>
                        <Footer />
                      </>
                    }
                  />
                  <Route
                    path="/checkout"
                    element={
                      <>
                        <Navbar />
                        <main className="flex-grow">
                          <Suspense fallback={<LoadingFallback />}>
                            <Checkout />
                          </Suspense>
                        </main>
                        <Footer />
                      </>
                    }
                  />
                  <Route
                    path="/order-confirmation"
                    element={
                      <>
                        <Navbar />
                        <main className="flex-grow">
                          <Suspense fallback={<LoadingFallback />}>
                            <OrderConfirmation />
                          </Suspense>
                        </main>
                        <Footer />
                      </>
                    }
                  />
                  
                  {/* Auth Routes */}
                  <Route 
                    path="/login" 
                    element={
                      <Suspense fallback={<LoadingFallback />}>
                        <Login />
                      </Suspense>
                    } 
                  />

                  {/* Admin Routes */}
                  <Route 
                    path="/admin" 
                    element={
                      <Suspense fallback={<LoadingFallback />}>
                        <ProtectedRoute>
                          <Suspense fallback={<LoadingFallback />}>
                            <AdminLayout />
                          </Suspense>
                        </ProtectedRoute>
                      </Suspense>
                    }
                  >
                    <Route 
                      index 
                      element={
                        <Suspense fallback={<LoadingFallback />}>
                          <AdminDashboard />
                        </Suspense>
                      } 
                    />
                    <Route 
                      path="products" 
                      element={
                        <Suspense fallback={<LoadingFallback />}>
                          <AdminProducts />
                        </Suspense>
                      } 
                    />
                    <Route 
                      path="services" 
                      element={
                        <Suspense fallback={<LoadingFallback />}>
                          <AdminServices />
                        </Suspense>
                      } 
                    />
                    <Route 
                      path="users" 
                      element={
                        <Suspense fallback={<LoadingFallback />}>
                          <AdminUsers />
                        </Suspense>
                      } 
                    />
                    <Route 
                      path="reports" 
                      element={
                        <Suspense fallback={<LoadingFallback />}>
                          <AdminReports />
                        </Suspense>
                      } 
                    />
                    <Route 
                      path="orders" 
                      element={
                        <Suspense fallback={<LoadingFallback />}>
                          <AdminOrders />
                        </Suspense>
                      } 
                    />
                    <Route 
                      path="email-settings" 
                      element={
                        <Suspense fallback={<LoadingFallback />}>
                          <AdminEmailSettings />
                        </Suspense>
                      } 
                    />
                    <Route 
                      path="shop-settings" 
                      element={
                        <Suspense fallback={<LoadingFallback />}>
                          <AdminShopSettings />
                        </Suspense>
                      } 
                    />
                  </Route>
                </Routes>
                <Toaster position="top-right" />
              </div>
            </Router>
          </CartProvider>
        </ServiceProvider>
      </ProductProvider>
    </AuthProvider>
  );
}

export default App;