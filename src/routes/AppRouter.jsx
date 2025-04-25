// src/routes/AppRouter.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home/Home';
import About from '../pages/About/About';
import Products from '../pages/Products/Products';
import ProductDetail from '../pages/ProductDetail/ProductDetail';
import Checkout from '../pages/Checkout/Checkout';
import Contact from '../pages/Contact/Contact';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import Dashboard from '../pages/Dashboard/Dashboard';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import ChatAssistant from '../components/ChatAssistant/ChatAssistant'; 
import NotFound404 from '../pages/404/404';
import { AuthProvider } from '../context/AuthContext';

function AppRouter() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <main style={{ minHeight: '80vh', padding: 'var(--spacing-md)' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<NotFound404 />} />
          </Routes>
        </main>
        <Footer />
        <ChatAssistant />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default AppRouter;
