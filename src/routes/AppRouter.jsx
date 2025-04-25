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
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import Dashboard from '../pages/Dashboard/Dashboard'; // Importar el Dashboard
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import ChatAssistant from '../components/ChatAssistant/ChatAssistant'; // Importar nuestro asistente virtual
import NotFound404 from '../pages/404/404'; // Import the 404 component
import { AuthProvider } from '../context/AuthContext'; // Importamos el proveedor de autenticación

function AppRouter() {
  return (
    <AuthProvider>
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
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<NotFound404 />} />
          </Routes>
        </main>
        <Footer />
        <ChatAssistant /> {/* Agregamos el asistente virtual aquí */}
      </BrowserRouter>
    </AuthProvider>
  );
}

export default AppRouter;
