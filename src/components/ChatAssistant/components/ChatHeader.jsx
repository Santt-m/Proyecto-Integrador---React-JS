import React from 'react';
import { FaTimes, FaSearch, FaTruck, FaVolumeUp, FaVolumeMute, FaTrash } from 'react-icons/fa';
import styles from '../ChatAssistant.module.css';
import uiTexts from '../data/uiTexts.json';

/**
 * Componente para el encabezado del chat con botones de acción y título
 * Con mejoras de accesibilidad y rendimiento
 */
const ChatHeader = ({ 
  minimizeChat, 
  isMinimized, 
  handleSearchClick, 
  handleTrackOrder,
  soundEnabled,
  toggleSound,
  clearChatHistory
}) => {
  return (
    <div className={styles.chatHeader}>
      {/* Título del chat */}
      <h2 id="chat-title" className={styles.chatTitle}>
        {uiTexts.chatInterface.title}
      </h2>
      
      {/* Botones de acción en el encabezado */}
      <div className={styles.chatHeaderButtons} role="toolbar" aria-label="Controles del chat">
        {/* Botón para alternar sonido */}
        <button 
          className={styles.headerButton} 
          onClick={toggleSound}
          aria-pressed={soundEnabled}
          aria-label={soundEnabled ? uiTexts.headerButtons.sound.on : uiTexts.headerButtons.sound.off}
          title={soundEnabled ? uiTexts.headerButtons.sound.on : uiTexts.headerButtons.sound.off}
        >
          {soundEnabled ? <FaVolumeUp /> : <FaVolumeMute />}
        </button>
        
        {/* Botón para limpiar historial */}
        <button 
          className={styles.headerButton} 
          onClick={clearChatHistory}
          aria-label={uiTexts.headerButtons.clear}
          title={uiTexts.headerButtons.clear}
        >
          <FaTrash />
        </button>
        
        {/* Botón para minimizar/maximizar */}
        <button 
          className={styles.headerButton} 
          onClick={minimizeChat}
          aria-label={isMinimized ? uiTexts.headerButtons.minimize.maximize : uiTexts.headerButtons.minimize.minimize}
          title={isMinimized ? uiTexts.headerButtons.minimize.maximize : uiTexts.headerButtons.minimize.minimize}
        >
          <FaTimes className={styles.minimizeIcon} />
        </button>
      </div>
    </div>
  );
};

export default React.memo(ChatHeader);