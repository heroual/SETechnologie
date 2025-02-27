import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Services from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';
import QuoteRequest from './pages/QuoteRequest';
import Login from './pages/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminServices from './pages/admin/Services';
import AdminUsers from './pages/admin/Users';
import AdminLayout from './components/admin/Layout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
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
                  <Products />
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
                  <ProductDetail />
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
                  <Services />
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
                  <About />
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
                  <Contact />
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
                  <QuoteRequest />
                </main>
                <Footer />
              </>
            }
          />
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>
        </Routes>
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;