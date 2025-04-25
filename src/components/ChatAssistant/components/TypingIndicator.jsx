import React from 'react';
import { FaRobot } from 'react-icons/fa';
import styles from '../ChatAssistant.module.css';
import uiTexts from '../data/uiTexts.json';

/**
 * Componente para mostrar el indicador de "escribiendo" cuando el bot está procesando
 * Con mejoras de accesibilidad - solo muestra la animación sin texto visible
 */
const TypingIndicator = () => {
  return (
    <div 
      className={styles.typingIndicatorContainer}
      role="status" 
      aria-live="polite"
      aria-label={uiTexts.chatInterface.typingIndicator}
    >
      <div className={styles.messageSender} aria-hidden="true">
        <FaRobot />
      </div>
      <div className={styles.typingIndicator}>
        <span className={`${styles.typingDot} ${styles.dot1}`} aria-hidden="true"></span>
        <span className={`${styles.typingDot} ${styles.dot2}`} aria-hidden="true"></span>
        <span className={`${styles.typingDot} ${styles.dot3}`} aria-hidden="true"></span>
      </div>
    </div>
  );
};

export default React.memo(TypingIndicator);