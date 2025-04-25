import React from 'react';
import { FaSearch, FaTruck, FaListUl, FaBell } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import styles from '../ChatAssistant.module.css';
import uiTexts from '../data/uiTexts.json';

/**
 * Componente para mostrar los botones de acción rápida del chat
 * Con soporte mejorado de accesibilidad
 */
const QuickActions = ({ handleSearchClick, handleTrackOrder, setIsOpen }) => {
  return (
    <div 
      className={styles.quickActions}
      role="toolbar"
      aria-label="Acciones rápidas del chat"
    >
      <button 
        className={styles.quickActionButton} 
        onClick={handleSearchClick} 
        title="Buscar productos"
        aria-label="Buscar productos"
      >
        <span className={styles.quickActionIcon} aria-hidden="true"><FaSearch /></span> 
        <span>{uiTexts.quickActions.search}</span>
      </button>
      <button 
        className={styles.quickActionButton} 
        onClick={handleTrackOrder} 
        title="Rastrear pedido"
        aria-label="Rastrear estado de pedido"
      >
        <span className={styles.quickActionIcon} aria-hidden="true"><FaTruck /></span> 
        <span>{uiTexts.quickActions.track}</span>
      </button>
      <Link 
        to="/products" 
        className={styles.quickActionButton} 
        title="Ver catálogo" 
        onClick={() => setIsOpen(false)}
        aria-label="Ver catálogo de productos"
      >
        <span className={styles.quickActionIcon} aria-hidden="true"><FaListUl /></span> 
        <span>{uiTexts.quickActions.catalog}</span>
      </Link>
      <Link 
        to="/contact" 
        className={styles.quickActionButton} 
        title="Contacto" 
        onClick={() => setIsOpen(false)}
        aria-label="Ir a página de contacto"
      >
        <span className={styles.quickActionIcon} aria-hidden="true"><FaBell /></span> 
        <span>{uiTexts.quickActions.contact}</span>
      </Link>
    </div>
  );
};

export default React.memo(QuickActions); // Uso de memo para evitar renderizados innecesarios