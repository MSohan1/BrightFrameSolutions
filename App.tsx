import React from 'react';
import ProductDetails from './pages/ProductDetails';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import About from './pages/About';
import Contact from './pages/Contact';
import FakeFruits from './pages/FakeFruits';
import Auth from './pages/Auth';
import OrderHistory from './pages/OrderHistory';
import Cart from './pages/Cart';
import Admin from './pages/Admin';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              {/*<Route path="/fake-fruits" element={<FakeFruits />} /> */}
              <Route path="/about" element={<About />} />
              <Route path="/products/:id" element={<ProductDetails />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/order-history" element={<OrderHistory />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>
          <Footer />
          <Toaster position="top-right" />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
