import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import styles from '../ChatAssistant.module.css';
import uiTexts from '../data/uiTexts.json';

/**
 * Componente para mostrar sugerencias y categorías en el chat
 * Con mejoras de accesibilidad y rendimiento
 */
const ChatSuggestions = ({ 
  suggestions,
  categories,
  onSuggestionClick,
  messageCount = 0,
  showSuggestionChips = true
}) => {
  // Estado para controlar si las sugerencias están minimizadas
  const [minimized, setMinimized] = useState(false);
  
  // Si no hay nada que mostrar, retornar null para evitar renderizado innecesario
  if (!showSuggestionChips) return null;
  
  // Función para manejar clic en sugerencia
  const handleSuggestionClick = (suggestion) => {
    if (onSuggestionClick) {
      onSuggestionClick(suggestion);
    }
  };
  
  // Función para manejar clic en categoría
  const handleCategoryClick = (category) => {
    if (onSuggestionClick) {
      onSuggestionClick(`Ver productos de ${category.name}`);
    }
  };
  
  // Función para alternar el estado minimizado
  const toggleMinimized = () => {
    setMinimized(!minimized);
  };
  
  // Contenido del componente dependiendo del estado minimizado
  if (minimized) {
    return (
      <div className={styles.suggestionsMinimized}>
        <button 
          onClick={toggleMinimized}
          className={styles.minimizeButton}
          aria-label="Mostrar sugerencias"
          title="Mostrar sugerencias"
        >
          <span>También puedes preguntarme</span>
          <FaChevronUp />
        </button>
      </div>
    );
  }
  
  // Mostrar sugerencias iniciales
  if (messageCount <= 2) {
    return (
      <div 
        className={styles.suggestions}
        aria-live="polite"
        aria-relevant="additions"
        role="region"
        aria-label="Preguntas frecuentes sugeridas"
      >
        <div className={styles.suggestionsHeader}>
          <p id="suggestionLabel">{uiTexts.suggestions?.initialTitle || "Prueba estas preguntas:"}</p>
          <button 
            onClick={toggleMinimized}
            className={styles.minimizeButton}
            aria-label="Minimizar sugerencias"
            title="Minimizar sugerencias"
          >
            <FaChevronDown />
          </button>
        </div>
        <div 
          className={styles.suggestionChips}
          role="group"
          aria-labelledby="suggestionLabel"
        >
          {suggestions && suggestions.map((suggestion, index) => (
            <button 
              key={index} 
              onClick={() => handleSuggestionClick(suggestion)}
              className={styles.suggestionChip}
              style={{ '--index': index }}
              aria-label={`Preguntar: ${suggestion}`}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    );
  }
  
  // Mostrar categorías después de algunas interacciones
  if (messageCount > 2 && messageCount < 5) {
    return (
      <div 
        className={styles.suggestions}
        aria-live="polite"
        aria-relevant="additions"
        role="region"
        aria-label="Categorías de productos"
      >
        <div className={styles.suggestionsHeader}>
          <p id="categoryLabel">{uiTexts.suggestions?.categoriesTitle || "Explora por categorías:"}</p>
          <button 
            onClick={toggleMinimized}
            className={styles.minimizeButton}
            aria-label="Minimizar sugerencias"
            title="Minimizar sugerencias"
          >
            <FaChevronDown />
          </button>
        </div>
        <div 
          className={styles.categoryChips}
          role="group"
          aria-labelledby="categoryLabel"
        >
          {categories && categories.map((category, index) => (
            <button 
              key={category.id || index} 
              onClick={() => handleCategoryClick(category)}
              className={styles.categoryChip}
              style={{ '--index': index }}
              aria-label={`Ver productos de ${category.name}`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    );
  }
  
  // Mostrar más sugerencias después de más interacciones
  if (messageCount >= 5 && messageCount < 8) {
    return (
      <div 
        className={styles.suggestions}
        aria-live="polite"
        aria-relevant="additions"
        role="region"
        aria-label="Sugerencias adicionales"
      >
        <div className={styles.suggestionsHeader}>
          <p id="moreSuggestionLabel">{uiTexts.suggestions?.moreTitle || "¿Necesitas ayuda con algo más?"}</p>
          <button 
            onClick={toggleMinimized}
            className={styles.minimizeButton}
            aria-label="Minimizar sugerencias"
            title="Minimizar sugerencias"
          >
            <FaChevronDown />
          </button>
        </div>
        <div 
          className={styles.suggestionChips}
          role="group"
          aria-labelledby="moreSuggestionLabel"
        >
          {suggestions && suggestions.map((suggestion, index) => (
            <button 
              key={index} 
              onClick={() => handleSuggestionClick(suggestion)}
              className={styles.suggestionChip}
              style={{ '--index': index }}
              aria-label={`Preguntar: ${suggestion}`}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    );
  }
  
  return null;
};

export default React.memo(ChatSuggestions); // Usar memo para evitar renderizados innecesarios