import React, { useState } from 'react';
import { FaPaperPlane, FaSmile } from 'react-icons/fa';
import styles from '../ChatAssistant.module.css';
import uiTexts from '../data/uiTexts.json';

/**
 * Componente para el pie del chat que incluye input del usuario
 * Con mejoras de accesibilidad y UX
 */
const ChatFooter = ({ 
  inputValue, 
  onInputChange, 
  onKeyDown, 
  onSendMessage,
  inputRef,
  searchMode,
  showEmojiPicker = false,
  setShowEmojiPicker = () => {},
  emojis = uiTexts.emojis || [],
  setInputValue,
  predictiveSuggestions = [],
  highlightedSuggestion = -1,
  onSuggestionClick
}) => {
  // Insertar emoji en el input
  const insertEmoji = (emoji) => {
    if (setInputValue) {
      setInputValue(prevValue => prevValue + emoji);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };
  
  // Manejar clic en una sugerencia predictiva
  const handleSuggestionClick = (suggestion) => {
    if (setInputValue && onSuggestionClick) {
      setInputValue(suggestion);
      onSuggestionClick(suggestion);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } else if (setInputValue) {
      setInputValue(suggestion);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };
  
  return (
    <div className={styles.chatFooter}>
      {/* Selector de emojis */}
      {showEmojiPicker && (
        <div className={styles.emojiPicker} role="dialog" aria-label="Selector de emojis">
          <div className={styles.emojiGrid}>
            {emojis.map((emoji, index) => (
              <button 
                key={index} 
                onClick={() => insertEmoji(emoji)}
                className={styles.emojiButton}
                aria-label={`Emoji ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Sugerencias predictivas */}
      {predictiveSuggestions.length > 0 && (
        <div className={styles.predictiveSuggestions} role="listbox" aria-label="Sugerencias">
          {predictiveSuggestions.map((suggestion, index) => (
            <div 
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`${styles.predictiveSuggestionItem} ${index === highlightedSuggestion ? styles.highlighted : ''}`}
              role="option"
              aria-selected={index === highlightedSuggestion}
              tabIndex={0}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
      
      {/* Input del usuario */}
      <div className={`${styles.inputWrapper} ${predictiveSuggestions?.length > 0 ? styles.activeSuggestions : ''}`}>
        <button 
          className={styles.emojiToggle}
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          aria-label={showEmojiPicker ? "Cerrar selector de emojis" : "Abrir selector de emojis"}
          title="Emojis"
          type="button"
        >
          <FaSmile />
        </button>
        
        <input
          type="text"
          value={inputValue || ''}
          onChange={onInputChange}
          onKeyDown={onKeyDown}
          ref={inputRef}
          placeholder={searchMode ? uiTexts.chatInterface.searchPlaceholder : uiTexts.chatInterface.inputPlaceholder}
          className={styles.chatInput}
          aria-label="Mensaje para el asistente"
          autoComplete="off"
        />
        
        <button 
          className={`${styles.sendButton} ${inputValue?.trim() ? styles.active : ''}`}
          onClick={onSendMessage}
          disabled={!inputValue?.trim()}
          aria-label={uiTexts.chatInterface.sendButtonLabel}
          title={uiTexts.chatInterface.sendButtonLabel}
          type="button"
        >
          <FaPaperPlane />
        </button>
      </div>
      
      {/* Texto de ayuda para lectores de pantalla */}
      <div className="sr-only" aria-live="polite">
        {predictiveSuggestions?.length > 0 ? 'Sugerencias disponibles. Use flechas para navegar.' : ''}
      </div>
    </div>
  );
};

export default React.memo(ChatFooter);