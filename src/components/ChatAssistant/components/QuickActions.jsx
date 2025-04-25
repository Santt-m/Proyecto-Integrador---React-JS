import React from 'react';
import { FaSearch, FaTruck, FaListUl, FaBell } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import styles from '../ChatAssistant.module.css';
import uiTexts from '../data/uiTexts.json';

/**
 * Componente para mostrar los botones de acción rápida del chat
 * Con soporte mejorado de accesibilidad
 */
const QuickActions = ({ onQuickAction }) => {
  return (
    <div 
      className={styles.quickActions}
      role="toolbar"
      aria-label={uiTexts.quickActions.actionsLabel}
    >
      <button 
        className={styles.quickActionButton} 
        onClick={() => onQuickAction('search')} 
        title={uiTexts.quickActions.searchTitle}
        aria-label={uiTexts.quickActions.searchLabel}
      >
        <span className={styles.quickActionIcon} aria-hidden="true"><FaSearch /></span> 
        <span>{uiTexts.quickActions.search}</span>
      </button>
      <button 
        className={styles.quickActionButton} 
        onClick={() => onQuickAction('track')} 
        title={uiTexts.quickActions.trackTitle}
        aria-label={uiTexts.quickActions.trackLabel}
      >
        <span className={styles.quickActionIcon} aria-hidden="true"><FaTruck /></span> 
        <span>{uiTexts.quickActions.track}</span>
      </button>
      <button 
        className={styles.quickActionButton} 
        onClick={() => onQuickAction('catalog')} 
        title={uiTexts.quickActions.catalogTitle}
        aria-label={uiTexts.quickActions.catalogLabel}
      >
        <span className={styles.quickActionIcon} aria-hidden="true"><FaListUl /></span> 
        <span>{uiTexts.quickActions.catalog}</span>
      </button>
      <button 
        className={styles.quickActionButton} 
        onClick={() => onQuickAction('contact')} 
        title={uiTexts.quickActions.contactTitle}
        aria-label={uiTexts.quickActions.contactLabel}
      >
        <span className={styles.quickActionIcon} aria-hidden="true"><FaBell /></span> 
        <span>{uiTexts.quickActions.contact}</span>
      </button>
    </div>
  );
};

export default React.memo(QuickActions); // Uso de memo para evitar renderizados innecesarios