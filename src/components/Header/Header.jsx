// src/components/Header/Header.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import CartMenu from '../CartMenu/CartMenu';
import styles from './Header.module.css';

function Header() {
  const { getTotalItems } = useCart();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartMenuOpen, setIsCartMenuOpen] = useState(false);
  const location = useLocation();

  const totalItems = getTotalItems();

  // Verificar si estamos en una página relacionada con productos
  const isProductsPage = location.pathname.includes('/products') || 
                         location.pathname.includes('/product/') || 
                         location.pathname.includes('/checkout');

  const handleToggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleToggleCartMenu = () => {
    setIsCartMenuOpen(!isCartMenuOpen);
  };

  const handleCloseCartMenu = () => {
    setIsCartMenuOpen(false);
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
    <>
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
            
            {/* Mostrar el botón del carrito solo en páginas de productos */}
            {isProductsPage && (
              <button 
                onClick={handleToggleCartMenu} 
                className={styles.cartButton}
                aria-label="Ver carrito"
              >
                🛒
                {totalItems > 0 && (
                  <span className={styles.cartItemCount}>{totalItems}</span>
                )}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Menú desplegable del carrito */}
      {isProductsPage && <CartMenu isOpen={isCartMenuOpen} onClose={handleCloseCartMenu} />}
    </>
  );
}

export default Header;
