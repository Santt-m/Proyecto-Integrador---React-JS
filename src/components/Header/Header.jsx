// src/components/Header/Header.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import CartMenu from '../CartMenu/CartMenu';
import styles from './Header.module.css';
// Importamos iconos
import { FaUserCircle, FaSignInAlt, FaUserPlus, FaTachometerAlt, FaSignOutAlt } from 'react-icons/fa';

function Header() {
  const { getTotalItems } = useCart();
  const { theme, toggleTheme } = useTheme();
  const { currentUser, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartMenuOpen, setIsCartMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const userMenuRef = useRef(null);

  const totalItems = getTotalItems();

  // Verificar si estamos en una página relacionada con productos
  const isProductsPage = location.pathname.includes('/products') || 
                        location.pathname.includes('/product/') || 
                        location.pathname.includes('/checkout');

  // Cerrar menú de usuario al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Cerrar menú móvil al cambiar de ruta
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleToggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    // Cerrar otros menús si están abiertos
    if (!isMobileMenuOpen) {
      setIsUserMenuOpen(false);
      setIsCartMenuOpen(false);
    }
  };

  const handleToggleCartMenu = () => {
    setIsCartMenuOpen(!isCartMenuOpen);
    // Cerrar otros menús
    setIsUserMenuOpen(false);
  };

  const handleCloseCartMenu = () => {
    setIsCartMenuOpen(false);
  };

  const handleToggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
    // Cerrar otros menús
    setIsCartMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const goToDashboard = () => {
    navigate('/dashboard');
    setIsUserMenuOpen(false);
  };

  // Función para determinar si un enlace está activo
  const isLinkActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <header className={`${styles.header} ${theme === 'dark' ? styles.darkHeader : ''}`}>
        <div className={styles.headerContainer}>
          <Link to="/" className={styles.headerLogo}>MiTienda</Link>

          <div className={styles.headerRight}>
            {/* Navegación principal */}
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
              {!currentUser && (
                <Link 
                  to="/register" 
                  className={isLinkActive('/register') ? styles.activeLink : ''}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Registro
                </Link>
              )}
            </nav>
            
            {/* Acciones del header (botones) */}
            <div className={styles.headerActions}>
              <button 
                onClick={toggleTheme} 
                className={styles.themeToggleButton}
                aria-label={theme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
              >
                {theme === 'light' ? '🌙' : '☀️'}
              </button>
              
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

              {/* Botón de usuario con icono */}
              {currentUser ? (
                <div className={styles.userContainer} ref={userMenuRef}>
                  <button 
                    onClick={handleToggleUserMenu} 
                    className={styles.userButton}
                    aria-label="Menú de usuario"
                  >
                    {currentUser.name.charAt(0).toUpperCase()}
                  </button>
                  
                  {isUserMenuOpen && (
                    <div className={styles.userMenu}>
                      <div className={styles.userName}>
                        Hola, {currentUser.name}
                      </div>
                      <button 
                        onClick={goToDashboard}
                        className={styles.menuOption}
                      >
                        <FaTachometerAlt className={styles.menuIcon} /> Dashboard
                      </button>
                      <button 
                        onClick={handleLogout}
                        className={styles.menuOption}
                      >
                        <FaSignOutAlt className={styles.menuIcon} /> Cerrar sesión
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className={styles.authIcons}>
                  <Link to="/login" className={styles.iconButton} title="Iniciar sesión">
                    <FaUserCircle />
                  </Link>
                </div>
              )}
              
              {/* Botón de menú móvil */}
              <button 
                className={styles.mobileMenuToggle} 
                onClick={handleToggleMobileMenu}
                aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
              >
                ☰
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Menú desplegable del carrito */}
      {isProductsPage && <CartMenu isOpen={isCartMenuOpen} onClose={handleCloseCartMenu} />}
    </>
  );
}

export default Header;
