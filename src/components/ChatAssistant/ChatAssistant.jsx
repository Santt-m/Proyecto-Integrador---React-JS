import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { FaRobot, FaTimes, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import styles from './ChatAssistant.module.css';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';

// Componentes modulares
import ChatHeader from './components/ChatHeader';
import ChatMessage from './components/ChatMessage';
import TypingIndicator from './components/TypingIndicator';
import ChatSuggestions from './components/ChatSuggestions';
import QuickActions from './components/QuickActions';
import ChatFooter from './components/ChatFooter';

// Funciones de utilidad y datos
import { 
  determineResponse, 
  generateSearchResponse, 
  generatePredictiveSuggestions, 
  optimizeMessageHistory,
  isProductAvailabilityQuery,
  getAvailabilityResponse,
  getSpecificWarrantyResponse,
  getRandomResponse,
  isBudgetQuery,
  getBudgetRecommendations,
  normalizeText,
  detectUserPreferredCategory
} from './utils';

// Importar datos de interfaz
import uiTexts from './data/uiTexts.json';
import chatResponses from './data/chatResponses.json';
import categoryData from './data/categories.json';

// Audio para notificaciones
const notificationSound = new Audio('/notification.mp3');

/**
 * Componente principal del Asistente de Chat
 */
function ChatAssistant() {
  const [isTyping, setIsTyping] = useState(false);
  const [currentInput, setCurrentInput] = useState('');
  const [messages, setMessages] = useState(() => {
    // Mensaje inicial de bienvenida
    const initialMessage = {
      id: Date.now(),
      sender: 'bot',
      text: getRandomResponse(chatResponses.saludos),
      timestamp: Date.now()
    };
    return [initialMessage];
  });
  const [showChat, setShowChat] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [searchMode, setSearchMode] = useState(false);
  const [feedbackMode, setFeedbackMode] = useState(false);
  const [showSuggestionChips, setShowSuggestionChips] = useState(true);
  const [predictiveSuggestions, setPredictiveSuggestions] = useState([]);
  const [highlightedSuggestion, setHighlightedSuggestion] = useState(-1);
  const [recentSearches, setRecentSearches] = useState([]);
  
  // Valores dinámicos para sugerencias
  const [suggestions] = useState(uiTexts.defaultSuggestions || [
    "¿Cómo realizo una compra?",
    "¿Cuáles son los métodos de pago?",
    "¿Tienen envío gratis?",
    "¿Qué ofertas tienen disponibles?"
  ]);
  
  // Obtener categorías de productos
  const categories = useMemo(() => {
    return categoryData.categories;
  }, []);

  const [isOpen, setIsOpen] = useState(false);
  const [messagesEndRef, inputRef, chatWindowRef] = [useRef(null), useRef(null), useRef(null)];
  const { theme } = useTheme();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const lastInteractionRef = useRef(null);
  const chatClosedWithPendingResponse = useRef(false);
  const messagesPerPage = 20; // Número de mensajes por página
  const totalPagesRef = useRef(1); // Referencia para el total de páginas
  const currentPageRef = useRef(1); // Referencia para la página actual

  // Declaración forward para evitar referencia circular
  const handleSendMessageRef = useRef(null);

  // Calcular número total de páginas
  const totalPages = Math.ceil(messages.length / messagesPerPage);
  
  // Actualizar la referencia de páginas totales cuando cambia
  useEffect(() => {
    totalPagesRef.current = totalPages;
  }, [totalPages]);

  // Actualizar la referencia de página actual cuando cambia
  useEffect(() => {
    currentPageRef.current = 1;
  }, []);

  // Efecto para hacer scroll al último mensaje
  useEffect(() => {
    if (messagesEndRef.current && isOpen) {
      const timer = setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [messages, isOpen]);

  // Efecto para enfocar el input cuando se abre el chat
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Abrir/cerrar el chat con animación
  const toggleChat = () => {
    if (!isOpen) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  // Manejar clic en un chip de sugerencia
  const handleSuggestionClick = useCallback((suggestion) => {
    // Establecer el mensaje en el input
    setCurrentInput(suggestion);
    
    // Enfocar el input para permitir al usuario modificar si lo desea
    inputRef.current?.focus();
    
    // Opcionalmente, enviar automáticamente el mensaje después de un breve retraso
    setTimeout(() => {
      // Solo enviar si el input aún contiene la sugerencia (el usuario no la modificó)
      if (inputRef.current?.value === suggestion) {
        handleSendMessageRef.current();
      }
    }, 500);
  }, []);

  // Manejar clic en una acción rápida
  const handleQuickAction = useCallback((action) => {
    switch(action) {
      case 'search':
        activateSearchMode();
        break;
      case 'track':
        handleTrackOrder();
        break;
      case 'catalog':
        navigate('/products');
        break;
      case 'contact':
        navigate('/contact');
        break;
      default:
        break;
    }
  }, [navigate]);

  // Activar modo de búsqueda
  const activateSearchMode = useCallback(() => {
    setSearchMode(true);
    addBotMessage(uiTexts.searchMode);
    inputRef.current?.focus();
  }, []);

  // Agregar mensaje del bot
  const addBotMessage = useCallback((text) => {
    setIsTyping(false);
    
    if (!text) {
      text = getRandomResponse(chatResponses.mensajesGenericos.noEntiendo);
    }
    
    const newMessage = {
      id: Date.now(),
      sender: 'bot',
      text,
      timestamp: Date.now()
    };
    
    // Comprobar si el chat está cerrado
    if (!isOpen) {
      chatClosedWithPendingResponse.current = true;
    }
    
    setMessages(prev => [...prev, newMessage]);
  }, [isOpen]);

  // Manejar comandos especiales que comienzan con /
  const handleSpecialCommands = useCallback((command) => {
    if (command === '/help') {
      addBotMessage(uiTexts.commandResponses.helpText);
      return;
    }
    
    if (command.startsWith('/buscar')) {
      const searchTerm = command.slice(8).trim();
      
      if (!searchTerm) {
        addBotMessage(uiTexts.commandResponses.searchNoTerm);
        return;
      }
      
      const response = uiTexts.commandResponses.searchWithTerm
        .replace('{searchTerm}', searchTerm)
        .replace('{searchTermEncoded}', encodeURIComponent(searchTerm));
      
      addBotMessage(response);
      return;
    }
    
    if (command === '/categorias') {
      let response = uiTexts.commandResponses.categoriesTitle;
      
      categories.forEach(category => {
        response += `• <a href="/products?category=${category.id}" class="chatLink">${category.name}</a><br>`;
      });
      
      addBotMessage(response);
      return;
    }
    
    if (command === '/ofertas') {
      addBotMessage(uiTexts.commandResponses.offersResponse);
      return;
    }
    
    // Comando no reconocido
    addBotMessage(uiTexts.commandResponses.unknownCommand);
  }, [categories, addBotMessage]);
  
  // Manejar clic en el botón de búsqueda
  const handleSearchClick = useCallback(() => {
    activateSearchMode();
  }, [activateSearchMode]);

  // Implementa la funcionalidad de seguimiento de pedidos
  const handleTrackOrder = useCallback(() => {
    addBotMessage(uiTexts.trackOrder);
  }, [addBotMessage]);

  // Manejar cambios en el input
  const handleInputChange = useCallback((e) => {
    setCurrentInput(e.target.value);
    
    // Generar sugerencias predictivas basadas en la entrada
    if (e.target.value.trim().length >= 2) {
      // Crear un objeto con las preferencias del usuario detectadas
      const userPreferences = {
        preferredCategory: detectUserPreferredCategory(messages),
        interestedInShipping: messages.some(msg => 
          msg.sender === 'user' && 
          normalizeText(msg.text).includes('envio')),
        recentQueries: messages
          .filter(msg => msg.sender === 'user')
          .slice(-5)
          .map(msg => msg.text)
      };
      
      // Llamar a la función mejorada con más contexto
      const suggestions = generatePredictiveSuggestions(
        e.target.value, 
        categories, 
        recentSearches,
        userPreferences,
        messages
      );
      
      setPredictiveSuggestions(suggestions);
    } else {
      setPredictiveSuggestions([]);
    }
    
    // Resetear la sugerencia resaltada
    setHighlightedSuggestion(-1);
  }, [categories, recentSearches, messages]);

  // Manejar teclas especiales (Enter, flechas para sugerencias)
  const handleKeyDown = useCallback((e) => {
    // Enter para enviar mensaje
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessageRef.current(); // Usar la referencia en lugar de la función directamente
    }
    
    // Flechas para navegar por las sugerencias predictivas
    if (predictiveSuggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightedSuggestion(prev => 
          prev < predictiveSuggestions.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightedSuggestion(prev => 
          prev > 0 ? prev - 1 : predictiveSuggestions.length - 1
        );
      } else if (e.key === 'Tab') {
        // Usar la sugerencia resaltada
        e.preventDefault();
        if (highlightedSuggestion >= 0) {
          setCurrentInput(predictiveSuggestions[highlightedSuggestion]);
          setPredictiveSuggestions([]);
        }
      }
    }
  }, [predictiveSuggestions, highlightedSuggestion]);

  // Manejar envío de mensajes
  const handleSendMessage = useCallback(() => {
    if (!currentInput.trim()) return;
    
    // Agregar mensaje del usuario
    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: currentInput,
      timestamp: Date.now()
    };
    
    // Crear una nueva lista de mensajes con el mensaje del usuario
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setCurrentInput('');
    setIsTyping(true);
    setShowEmojiPicker(false);
    setPredictiveSuggestions([]);
    setHighlightedSuggestion(-1);
    
    // Evitar mostrar sugerencias de chips después de varias interacciones
    if (updatedMessages.length > 10) {
      setShowSuggestionChips(false);
    }
    
    // Comandos especiales
    if (currentInput.toLowerCase().startsWith('/')) {
      handleSpecialCommands(currentInput.toLowerCase());
      return;
    }

    // Tiempo de respuesta variable
    const messageLength = currentInput.length;
    const thinkingTime = Math.min(1000 + messageLength * 5, 2500); 

    const timer = setTimeout(() => {
      let botResponse;
      
      // Verificar si es una consulta de disponibilidad de producto
      const availabilityQuery = isProductAvailabilityQuery(currentInput);
      
      if (availabilityQuery.isAvailability) {
        // Generar respuesta de disponibilidad
        botResponse = getAvailabilityResponse(availabilityQuery);
      } else if (searchMode) {
        botResponse = generateSearchResponse(currentInput, categories);
        setSearchMode(false);
      } else if (feedbackMode) {
        botResponse = uiTexts.feedbackResponses.positive;
        setFeedbackMode(false);
      } else {
        // Verificar si es una consulta de presupuesto/recomendaciones
        const budgetQuery = isBudgetQuery(currentInput);
        if (budgetQuery.isBudget) {
          botResponse = getBudgetRecommendations(budgetQuery);
        } else {
          // Generar respuesta basada en el análisis del mensaje
          botResponse = determineResponse(currentInput, {
            // Preferencias del usuario basadas en su historial
            preferredCategory: detectUserPreferredCategory(updatedMessages),
            // Intereses detectados
            interestedInShipping: updatedMessages.some(msg => 
              msg.sender === 'user' && 
              normalizeText(msg.text).includes('envio')),
          });
        }
      }
      
      // Agregar mensaje del bot
      addBotMessage(botResponse);
      
      // Optimizar historial para conversaciones largas
      if (updatedMessages.length > 50) {
        setMessages(prev => optimizeMessageHistory(prev));
      }
    }, thinkingTime);
    
    return () => clearTimeout(timer);
  }, [currentInput, messages, searchMode, feedbackMode, categories, addBotMessage]);

  // Asignar la referencia de la función
  useEffect(() => {
    handleSendMessageRef.current = handleSendMessage;
  }, [handleSendMessage]);

  // Escuchar el evento de sugerencia enviada desde ChatFooter o ChatSuggestions
  useEffect(() => {
    const handleSendSuggestion = (event) => {
      const { suggestion, clearInput } = event.detail;
      
      // Limpiar el input inmediatamente si se indica (para evitar envíos dobles)
      if (clearInput) {
        setCurrentInput('');
      }
      
      // Crear un mensaje del usuario con la sugerencia completa
      const userMessage = {
        id: Date.now(),
        sender: 'user',
        text: suggestion,
        timestamp: Date.now()
      };
      
      // Añadir el mensaje del usuario al chat
      setMessages(prev => [...prev, userMessage]);
      
      // Limpiar el input y las sugerencias
      setPredictiveSuggestions([]);
      setIsTyping(true);
      
      // Generar respuesta del bot con un tiempo de espera realista
      setTimeout(() => {
        let botResponse;
        
        // Verificar si es una consulta de disponibilidad de producto
        const availabilityQuery = isProductAvailabilityQuery(suggestion);
        
        if (availabilityQuery.isAvailability) {
          // Generar respuesta de disponibilidad
          botResponse = getAvailabilityResponse(availabilityQuery);
        } else if (searchMode) {
          botResponse = generateSearchResponse(suggestion, categories);
          setSearchMode(false);
        } else {
          // Verificar si es una consulta de presupuesto/recomendaciones
          const budgetQuery = isBudgetQuery(suggestion);
          if (budgetQuery.isBudget) {
            botResponse = getBudgetRecommendations(budgetQuery);
          } else {
            // Generar respuesta basada en el análisis del mensaje
            botResponse = determineResponse(suggestion, {
              preferredCategory: detectUserPreferredCategory(messages),
              interestedInShipping: messages.some(msg => 
                msg.sender === 'user' && 
                normalizeText(msg.text).includes('envio')),
            });
          }
        }
        
        // Añadir la respuesta del bot
        addBotMessage(botResponse);
      }, 1500);
    };
    
    // Registrar el evento
    document.addEventListener('sendSuggestion', handleSendSuggestion);
    
    // Limpiar el evento al desmontar
    return () => {
      document.removeEventListener('sendSuggestion', handleSendSuggestion);
    };
  }, [messages, addBotMessage, categories, searchMode]);

  return (
    <div className={`${styles.chatAssistantContainer} ${theme}`} role="complementary" aria-label={uiTexts.chatInterface.assistantLabel}>
      {/* Botón flotante para abrir/cerrar el chat */}
      <button 
        className={`${styles.chatButton} ${isOpen ? styles.open : ''}`}
        onClick={toggleChat}
        aria-label={isOpen ? uiTexts.headerButtons.close : uiTexts.headerButtons.open}
        title={uiTexts.chatInterface.title}
      >
        {isOpen ? <FaTimes /> : <FaRobot />}
      </button>
      
      {/* Ventana del chat */}
      {isOpen && (
        <div 
          className={`${styles.chatWindow}`}
          ref={chatWindowRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="chat-title"
        >
          {/* Cabecera del chat */}
          <ChatHeader />
          
          {/* Cuerpo del chat (mensajes) */}
          <div className={styles.chatBody}>
            <div className={styles.messagesContainer} role="log" aria-live="polite" aria-atomic="false">
              {messages.map(message => (
                <ChatMessage 
                  key={message.id} 
                  message={message} 
                />
              ))}
              
              {/* Indicador de escritura */}
              {isTyping && <TypingIndicator />}
              
              <div ref={messagesEndRef} tabIndex={-1} />
            </div>
            
            {/* Sugerencias */}
            <ChatSuggestions 
              suggestions={suggestions}
              categories={categories}
              onSuggestionClick={handleSuggestionClick}
              messageCount={messages.length}
              showSuggestionChips={showSuggestionChips}
            />
          </div>
          
          {/* Acciones rápidas */}
          <QuickActions onQuickAction={handleQuickAction} />
          
          {/* Pie del chat (input del usuario) */}
          <ChatFooter 
            inputValue={currentInput}
            setInputValue={setCurrentInput}
            onInputChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onSendMessage={handleSendMessage}
            inputRef={inputRef}
            searchMode={searchMode}
            showEmojiPicker={showEmojiPicker}
            setShowEmojiPicker={setShowEmojiPicker}
            emojis={uiTexts.emojis}
            predictiveSuggestions={predictiveSuggestions}
            highlightedSuggestion={highlightedSuggestion}
            onSuggestionClick={(suggestion) => {
              setCurrentInput(suggestion);
              setPredictiveSuggestions([]);
              handleSendMessageRef.current();
            }}
          />
        </div>
      )}
    </div>
  );
}

export default ChatAssistant;