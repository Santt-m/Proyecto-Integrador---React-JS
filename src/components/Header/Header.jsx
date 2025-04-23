// src/components/Header/Header.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import styles from './Header.module.css';

function Header() {
  const { getTotalItems } = useCart();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const totalItems = getTotalItems();

  const shouldShowCart = location.pathname === '/products' || location.pathname.startsWith('/products/');

  const handleToggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Función para determinar si un enlace está activo
  const isLinkActive = (path) => {
    // Para la página de inicio, verificamos que sea exactamente "/"
    if (path === '/') {
      return location.pathname === '/';
    }
    // Para otras páginas, verificamos si la ruta actual comienza con el path
    return location.pathname.startsWith(path);
  };

  return (
    <header className={`${styles.header} ${theme === 'dark' ? styles.darkHeader : ''}`}>
      <div className={styles.headerContainer}>
        <Link to="/" className={styles.headerLogo}>MiTienda</Link>

        <button className={styles.mobileMenuToggle} onClick={handleToggleMobileMenu}>
          ☰
        </button>

        <nav className={`${styles.mainNav} ${isMobileMenuOpen ? styles.open : ''}`}>
          {isMobileMenuOpen && (
            <button className={styles.mobileMenuClose} onClick={handleToggleMobileMenu}>
              ✕
            </button>
          )}
          <Link 
            to="/" 
            className={isLinkActive('/') ? styles.activeLink : ''}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Inicio
          </Link>
          <Link 
            to="/products" 
            className={isLinkActive('/products') ? styles.activeLink : ''}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Productos
          </Link>
          <Link 
            to="/about" 
            className={isLinkActive('/about') ? styles.activeLink : ''}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Acerca de
          </Link>
          <Link 
            to="/contact" 
            className={isLinkActive('/contact') ? styles.activeLink : ''}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Contacto
          </Link>
        </nav>

        <div className={styles.headerActions}>
          <button onClick={toggleTheme} className={styles.themeToggleButton}>
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          {shouldShowCart && (
            <Link to="/checkout" className={styles.cartIconLink}>
              🛒<span className={styles.cartItemCount}>{totalItems > 0 ? totalItems : ''}</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
