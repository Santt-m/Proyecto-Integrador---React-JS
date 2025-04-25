/**
 * Funciones de utilidad general para el asistente de chat
 */

import chatResponses from '../data/chatResponses.json';
import uiTexts from '../data/uiTexts.json';
import userInputPatterns from '../data/userInputPatterns.json';

/**
 * Normaliza un texto para comparación (elimina acentos, minúsculas, etc.)
 */
export function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Eliminar acentos
    .replace(/[.,;:¿?¡!]/g, "") // Eliminar puntuación común
    .replace(/\s+/g, " ") // Normalizar espacios
    .trim();
}

/**
 * Formatea una marca de tiempo para mostrarla en la interfaz de chat
 * @param {number|Date} timestamp - Marca de tiempo en milisegundos o un objeto Date
 * @returns {string} Tiempo formateado como "HH:MM"
 */
export function formatTime(timestamp) {
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Renderiza contenido HTML de forma segura para mostrar en el chat
 * @param {string} htmlContent - Contenido HTML a renderizar
 * @returns {Object} Objeto para usar con dangerouslySetInnerHTML
 */
export function renderHTML(htmlContent) {
  // Sanitizar el HTML para prevenir ataques XSS
  // Solo permitimos ciertos tags seguros
  const sanitizedHTML = htmlContent
    .replace(/<(?!\/?(a|br|strong|em|ul|li|p|span)(?=>|\s.*>))\/?(?:.|\s)*?>/gi, '')
    .replace(/href="javascript:/gi, 'href="#"');
  
  return { __html: sanitizedHTML };
}

/**
 * Optimiza el historial de mensajes para conversaciones largas
 * Preserva el primer mensaje de bienvenida y los mensajes más recientes
 */
export function optimizeMessageHistory(messages, maxLength = 50) {
  if (messages.length <= maxLength) {
    return messages;
  }
  
  // Mantener primer mensaje (bienvenida) y los últimos (maxLength - 1) mensajes
  const firstMessage = messages[0];
  const recentMessages = messages.slice(-(maxLength - 1));
  
  return [firstMessage, ...recentMessages];
}

/**
 * Función mejorada para detectar si un mensaje contiene solo emojis
 * Usa una regex compatible con todos los navegadores
 */
export function containsOnlyEmojis(text) {
  // La expresión regular incluye rangos Unicode para emojis comunes
  // y es compatible con distintos navegadores
  const emojiPattern = /^[\u{1F300}-\u{1F9FF}\u{2600}-\u{27BF}\u{2700}-\u{27BF}\u{2300}-\u{23FF}\u{2B50}\u{1F004}-\u{1F0CF}\u{1F170}-\u{1F251}❤\s]+$/u;
  
  // Usar los emojis comunes desde el archivo JSON
  const commonEmojis = userInputPatterns.userInputPatterns.emojisComunes || [
    '❤️', '👍', '👎', '😊', '😂', '🙏', '👋', '🤔', '😢', '😍', '🔥'
  ];
  
  const trimmedText = text.trim();
  
  // Verificar si el texto es solo un emoji común
  if (commonEmojis.includes(trimmedText)) {
    return true;
  }
  
  // Para textos más largos, verificar si son solo múltiples emojis
  const textWithoutSpaces = trimmedText.replace(/\s/g, '');
  
  if (textWithoutSpaces.length <= 8 && emojiPattern.test(trimmedText)) {
    return true;
  }
  
  return false;
}

/**
 * Retorna una respuesta aleatoria de un array de posibles respuestas
 */
export function getRandomResponse(responses) {
  const index = Math.floor(Math.random() * responses.length);
  return responses[index];
}

/**
 * Genera sugerencias predictivas basadas en el texto de entrada del usuario
 * Analiza el contexto para proporcionar sugerencias relevantes
 */
export function generatePredictiveSuggestions(inputText, categories = [], recentSearches = [], userPreferences = {}, messages = []) {
  if (!inputText || inputText.trim().length < 2) {
    return [];
  }
  
  const normalizedInput = normalizeText(inputText).toLowerCase();
  const suggestions = [];
  
  // Usar los datos de uiTexts que ya importamos al inicio del archivo
  const predictiveTextData = uiTexts.predictiveSuggestions;
  
  // Si predictiveSuggestions no existe en uiTexts, devolver array vacío
  if (!predictiveTextData) {
    return [];
  }
  
  // Detectar patrones coloquiales comunes para sugerencias específicas
  if (detectColoquialPatron(normalizedInput, 'quiero', ['quiero', 'quisiera', 'querría', 'me gustaria', 'me encantaria']) && 
      !detectColoquialPatron(normalizedInput, 'comprar', ['comprar', 'adquirir', 'conseguir', 'obtener', 'llevarme'])) {
    // Si contiene "quiero" pero no "comprar"
    if (predictiveTextData.quieroSuggestions) {
      suggestions.push(...predictiveTextData.quieroSuggestions.slice(0, 4));
    }
  }
  
  // Si contiene "quiero comprar"
  if (detectColoquialPatron(normalizedInput, 'quiero', ['quiero', 'quisiera', 'querría', 'me gustaria', 'me encantaria']) && 
      detectColoquialPatron(normalizedInput, 'comprar', ['comprar', 'adquirir', 'conseguir', 'obtener', 'llevarme'])) {
    if (predictiveTextData.quieroComprarSuggestions) {
      suggestions.push(...predictiveTextData.quieroComprarSuggestions.slice(0, 4));
    }
  }
  
  // Si contiene "necesito"
  if (detectColoquialPatron(normalizedInput, 'necesito', ['necesito', 'me hace falta', 'preciso', 'requiero'])) {
    if (predictiveTextData.necesito) {
      suggestions.push(...predictiveTextData.necesito.slice(0, 3));
    }
  }
  
  // Si contiene "busco"
  if (detectColoquialPatron(normalizedInput, 'busco', ['busco', 'estoy buscando', 'trato de encontrar', 'ando buscando'])) {
    if (predictiveTextData.buscoSuggestions) {
      suggestions.push(...predictiveTextData.buscoSuggestions.slice(0, 3));
    }
  }
  
  // Si contiene "me gustaría"
  if (detectColoquialPatron(normalizedInput, 'meGustaria', ['me gustaria', 'me encantaria', 'seria bueno', 'estaria bien'])) {
    if (predictiveTextData.meGustaría) {
      suggestions.push(...predictiveTextData.meGustaría.slice(0, 3));
    }
  }
  
  // Si contiene "ayúdame" o similar
  if (detectColoquialPatron(normalizedInput, 'ayuda', ['ayudame', 'ayuda', 'ayudar', 'echame una mano', 'orientame'])) {
    if (predictiveTextData.ayudameSuggestions) {
      suggestions.push(...predictiveTextData.ayudameSuggestions.slice(0, 3));
    }
  }
  
  // Si contiene petición de recomendación
  if (detectColoquialPatron(normalizedInput, 'recomienda', ['recomendacion', 'recomienda', 'recomiendan', 'recomiendame', 'sugerencia'])) {
    if (predictiveTextData.recomendacionesSuggestions) {
      suggestions.push(...predictiveTextData.recomendacionesSuggestions.slice(0, 3));
    }
  }
  
  // Verificar contexto para sugerencias más relevantes
  const context = detectMessageContext(normalizedInput, messages);
  
  // Añadir sugerencias contextuales si existen
  if (context && predictiveTextData.contextual && predictiveTextData.contextual[context]) {
    suggestions.push(...predictiveTextData.contextual[context].slice(0, 3));
  }
  
  // Añadir sugerencias comunes que coincidan con la entrada
  if (predictiveTextData.common && suggestions.length < 5) {
    const commonSuggestions = predictiveTextData.common.filter(suggestion => 
      normalizeText(suggestion).includes(normalizedInput)
    );
    suggestions.push(...commonSuggestions.slice(0, 3));
  }
  
  // Sugerencias basadas en la categoría preferida del usuario
  if (userPreferences.preferredCategory && predictiveTextData.categoryPreferences && suggestions.length < 5) {
    const preferredCategory = userPreferences.preferredCategory;
    const categorySuggestions = predictiveTextData.categoryPreferences.map(template => 
      template.replace('{category}', preferredCategory)
    );
    suggestions.push(...categorySuggestions.slice(0, 2)); // Limitar a 2 sugerencias de categoría
  }
  
  // Añadir sufijos de sugerencias si hay pocas sugerencias
  if (suggestions.length < 3 && inputText.length > 3) {
    if (predictiveTextData.searchSuffix) {
      suggestions.push(predictiveTextData.searchSuffix.replace('{inputText}', inputText));
    }
    
    if (predictiveTextData.infoSuffix) {
      suggestions.push(predictiveTextData.infoSuffix.replace('{inputText}', inputText));
    }
    
    if (predictiveTextData.offerSuffix && !normalizedInput.includes('oferta')) {
      suggestions.push(predictiveTextData.offerSuffix.replace('{inputText}', inputText));
    }
    
    if (predictiveTextData.recomendacionSuffix && !normalizedInput.includes('recomienda')) {
      suggestions.push(predictiveTextData.recomendacionSuffix.replace('{inputText}', inputText));
    }
    
    if (predictiveTextData.mejorSuffix && !normalizedInput.includes('mejor')) {
      suggestions.push(predictiveTextData.mejorSuffix.replace('{inputText}', inputText));
    }
    
    if (predictiveTextData.disponibilidadSuffix && !normalizedInput.includes('disponible') && !normalizedInput.includes('tienen')) {
      suggestions.push(predictiveTextData.disponibilidadSuffix.replace('{inputText}', inputText));
    }
  }
  
  // Filtrar y deduplicar sugerencias
  const uniqueSuggestions = [...new Set(suggestions)];
  
  // Priorizar las sugerencias más relevantes
  const prioritizedSuggestions = uniqueSuggestions
    .sort((a, b) => {
      const scoreA = calculateSuggestionRelevance(a, normalizedInput, userPreferences);
      const scoreB = calculateSuggestionRelevance(b, normalizedInput, userPreferences);
      return scoreB - scoreA;
    })
    .slice(0, 5); // Limitar a 5 sugerencias finales
  
  return prioritizedSuggestions;
}

/**
 * Detecta el contexto principal del mensaje actual
 * @private
 */
function detectMessageContext(normalizedInput, messages) {
  // Usar los patrones contextuales desde el archivo JSON si están disponibles
  // Si no, usar los patrones definidos aquí como fallback
  let contextPatterns;
  
  if (userInputPatterns.userInputPatterns.patronesContextuales) {
    contextPatterns = userInputPatterns.userInputPatterns.patronesContextuales;
  } else {
    // Fallback a patrones definidos en el código
    contextPatterns = {
      'envio': ['envio', 'enviar', 'delivery', 'llegara', 'llega', 'entrega'],
      'pago': ['pago', 'pagar', 'tarjeta', 'efectivo', 'factura', 'cuotas', 'credito'],
      'productos': ['producto', 'catalogo', 'stock', 'disponible', 'venden', 'tienen'],
      'garantia': ['garantia', 'devolucion', 'cambio', 'roto', 'defecto', 'falla'],
      'cuentaUsuario': ['cuenta', 'login', 'registro', 'contrasena', 'password', 'usuario'],
      'regalo': ['regalo', 'present', 'envolver', 'cumpleanos', 'aniversario']
    };
  }
  
  // Verificar coincidencias con patrones de contexto
  for (const [context, patterns] of Object.entries(contextPatterns)) {
    if (patterns.some(pattern => normalizedInput.includes(pattern))) {
      return context;
    }
  }
  
  // Si no hay coincidencia clara en el mensaje actual, analizar mensajes recientes
  if (messages && messages.length > 0) {
    const recentUserMessages = messages
      .filter(msg => msg.sender === 'user')
      .slice(-3)
      .map(msg => normalizeText(msg.text));
    
    for (const [context, patterns] of Object.entries(contextPatterns)) {
      // Si algún mensaje reciente contiene alguno de los patrones
      if (recentUserMessages.some(msg => 
        patterns.some(pattern => msg.includes(pattern)))) {
        return context;
      }
    }
  }
  
  return null;
}

/**
 * Calcula la relevancia de una sugerencia para la entrada actual
 * @private
 */
function calculateSuggestionRelevance(suggestion, normalizedInput, userPreferences) {
  const normalizedSuggestion = normalizeText(suggestion);
  let score = 0;
  
  // 1. Coincidencia directa con la entrada
  if (normalizedSuggestion.includes(normalizedInput)) {
    score += 3;
    // Bonus si la coincidencia es al principio
    if (normalizedSuggestion.startsWith(normalizedInput)) {
      score += 1;
    }
  }
  
  // 2. Coincidencia con categoría preferida
  if (userPreferences.preferredCategory && 
      normalizedSuggestion.includes(normalizeText(userPreferences.preferredCategory))) {
    score += 2;
  }
  
  // 3. Coincidencia con intereses detectados
  if (userPreferences.interestedInShipping && 
      (normalizedSuggestion.includes('envio') || normalizedSuggestion.includes('entrega'))) {
    score += 1.5;
  }
  
  // 4. Preguntas más cortas tienen prioridad (más fáciles de leer)
  score -= normalizedSuggestion.length * 0.001;
  
  return score;
}

/**
 * Detecta patrones coloquiales en el texto normalizado
 * @private
 */
function detectColoquialPatron(normalizedInput, type, keywords = null) {
  // Si se proporcionan palabras clave directamente, usarlas
  // Esto es para mantener compatibilidad con código existente
  if (keywords) {
    return keywords.some(keyword => normalizedInput.includes(keyword));
  }
  
  // Si no, buscar en los patrones definidos en userInputPatterns.json
  const patronesColoquiales = userInputPatterns.userInputPatterns.patronesColoquiales || {};
  const patrones = patronesColoquiales[type] || [];
  
  return patrones.some(keyword => normalizedInput.includes(keyword));
}