import React from 'react';
import styles from '../ChatAssistant.module.css';
import { FaUser, FaRobot, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { formatTime, renderHTML } from '../utils/chatUtils';
import uiTexts from '../data/uiTexts.json';

/**
 * Componente para mostrar un mensaje individual en el chat
 * Con mejor accesibilidad y soporte para HTML seguro en respuestas
 */
const ChatMessage = ({ message, messageToRate, handleFeedback }) => {
  const { text, sender, timestamp, id } = message;
  const isBot = sender === 'bot';
  const showFeedback = isBot && messageToRate === id;
  
  // Determinar si el mensaje contiene HTML que debe renderizarse
  const containsHTML = isBot && 
    (text.includes('<a') || 
     text.includes('<br') || 
     text.includes('<strong') || 
     text.includes('<ul') || 
     text.includes('<li'));
  
  return (
    <div 
      className={`${styles.message} ${isBot ? styles.botMessage : styles.userMessage}`}
      role={isBot ? "log" : "complementary"}
      aria-label={`Mensaje de ${isBot ? 'asistente' : 'usuario'}`}
    >
      <div className={styles.messageContent}>
        <div className={styles.messageSender} aria-hidden="true">
          {isBot ? <FaRobot /> : <FaUser />}
        </div>
        <div className={styles.messageText}>
          {containsHTML ? (
            <span 
              dangerouslySetInnerHTML={renderHTML(text)}
              role="region"
              aria-label="Mensaje con enlaces"
            />
          ) : (
            <span>{text}</span>
          )}
          
          {/* Botones de feedback (thumbs up/down) */}
          {showFeedback && (
            <div 
              className={styles.feedbackButtons}
              role="group"
              aria-label="¿Fue útil esta respuesta?"
            >
              <span className={styles.feedbackText}>{uiTexts.chatInterface.messageFeedback}</span>
              <button 
                onClick={() => handleFeedback(true)}
                className={styles.feedbackButton}
                aria-label={uiTexts.chatInterface.messageFeedbackYes}
                title={uiTexts.chatInterface.messageFeedbackYes}
              >
                <FaThumbsUp />
              </button>
              <button 
                onClick={() => handleFeedback(false)}
                className={styles.feedbackButton}
                aria-label={uiTexts.chatInterface.messageFeedbackNo}
                title={uiTexts.chatInterface.messageFeedbackNo}
              >
                <FaThumbsDown />
              </button>
            </div>
          )}
          
          {/* Marca de tiempo */}
          <div className={styles.messageTimestamp} aria-hidden="true">
            {formatTime(timestamp)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ChatMessage);