// src/routes/AppRouter.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// Placeholder imports - create these files next
import Home from '../pages/Home/Home';
import About from '../pages/About/About';
import Products from '../pages/Products/Products';
import ProductDetail from '../pages/ProductDetail/ProductDetail';
import Checkout from '../pages/Checkout/Checkout';
import Contact from '../pages/Contact/Contact';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import NotFound404 from '../pages/404/404'; // Import the 404 component

function AppRouter() {
  return (
    <BrowserRouter>
      <Header /> {/* Header and Footer outside Routes to be on all pages */}
      {/* Use CSS variable for padding */}
      <main style={{ minHeight: '80vh', padding: 'var(--spacing-md)' }}> {/* Basic layout wrapper */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound404 />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default AppRouter;
