import chatResponses from '../data/chatResponses.json';
import faqs from '../data/faqs.json';
import productPatterns from '../data/productPatterns.json';
import knowledgeBase from '../data/knowledgeBase.json';
import categoryData from '../data/categories.json';
import productsData from '../../../data/products.json';
import userInputPatterns from '../data/userInputPatterns.json';
import styles from '../ChatAssistant.module.css';

/**
 * Determina la respuesta adecuada basada en el mensaje del usuario y sus preferencias
 * Versión mejorada con sistema de puntuación y priorización
 */
export const determineResponse = (userMessage, userPreferences = {}) => {
  // Validar entrada para mensajes vacíos o muy cortos
  if (!userMessage || userMessage.trim() === '') {
    return chatResponses.mensajesGenericos.mensajeVacio;
  }
  
  if (userMessage.trim().length <= 2) {
    return chatResponses.mensajesGenericos.mensajeCorto;
  }

  // Comprobar si es solo un emoji
  if (containsOnlyEmojis(userMessage)) {
    return handleEmojiResponse(userMessage);
  }

  // Detectar consulta de hora actual
  if (isTimeRequest(userMessage)) {
    return handleTimeRequest();
  }

  // Detectar consulta de fecha actual
  if (isDateRequest(userMessage)) {
    return handleDateRequest();
  }

  // Detectar agradecimientos
  if (isThanksMessage(userMessage)) {
    return chatResponses.mensajesGenericos.agradecimiento;
  }

  // Detectar consulta de presupuesto
  const budgetQuery = isBudgetQuery(userMessage);
  if (budgetQuery.isBudget) {
    return getBudgetRecommendations(budgetQuery);
  }

  // Usar patrones de entrada definidos en userInputPatterns.json para detectar intención
  const userIntent = detectUserIntent(userMessage);
  if (userIntent && knowledgeBase[userIntent]) {
    // Si encontramos una intención clara, devolver respuesta directa de knowledgeBase
    return getRandomResponse(knowledgeBase[userIntent]);
  }

  // Búsqueda de respuestas en la base de conocimiento con sistema de puntuación
  const scoredResponses = [];
  
  // 1. Verificar coincidencias en FAQs (preguntas frecuentes)
  for (const faq of faqs) {
    const score = calculateMatchScore(userMessage, faq.question);
    
    // Bonus de puntuación para coincidencias exactas o casi exactas
    if (score > 0.8) {
      scoredResponses.push({
        text: faq.answer,
        score: score * 1.5, // Multiplicador para priorizar FAQs
        type: 'faq'
      });
    } else if (score > 0.5) {
      scoredResponses.push({
        text: faq.answer,
        score: score * 1.2,
        type: 'faq'
      });
    }
  }
  
  // 2. Verificar coincidencias en procesos
  for (const processKey in chatResponses.procesosConPasos) {
    const process = chatResponses.procesosConPasos[processKey];
    const keywords = getProcessKeywords(processKey);
    
    // Calcular puntuación basada en palabras clave del proceso
    let maxScore = 0;
    for (const keyword of keywords) {
      const keywordScore = calculateMatchScore(userMessage, keyword);
      maxScore = Math.max(maxScore, keywordScore);
    }
    
    if (maxScore > 0.6) {
      const formattedResponse = formatProcessResponse(process);
      scoredResponses.push({
        text: formattedResponse,
        score: maxScore * 1.1, // Prioridad ligeramente mayor que información básica
        type: 'process'
      });
    }
  }
  
  // 3. Verificar coincidencias en listas de información
  for (const infoKey in chatResponses.infoConListas) {
    const info = chatResponses.infoConListas[infoKey];
    const keywords = getInfoKeywords(infoKey);
    
    let maxScore = 0;
    for (const keyword of keywords) {
      const keywordScore = calculateMatchScore(userMessage, keyword);
      maxScore = Math.max(maxScore, keywordScore);
    }
    
    if (maxScore > 0.5) {
      const formattedResponse = formatInfoResponse(info);
      scoredResponses.push({
        text: formattedResponse,
        score: maxScore,
        type: 'info'
      });
    }
  }
  
  // 4. Buscar en garantías específicas por tipo de producto
  if (isWarrantyRequest(userMessage)) {
    const warrantyType = getWarrantyType(userMessage);
    if (warrantyType && chatResponses.garantias[warrantyType]) {
      scoredResponses.push({
        text: chatResponses.garantias[warrantyType],
        score: 0.9, // Alta prioridad para consultas específicas de garantía
        type: 'warranty'
      });
    } else {
      // Si es una consulta general de garantía, usar la info de listas
      const info = chatResponses.infoConListas.garantias;
      if (info) {
        scoredResponses.push({
          text: formatInfoResponse(info),
          score: 0.85,
          type: 'info'
        });
      }
    }
  }
  
  // 5. Buscar en la base de conocimiento general
  // Convertir el objeto knowledgeBase en un array de entradas para poder iterarlo
  const knowledgeEntries = Object.keys(knowledgeBase).map(key => ({
    key: key,
    keywords: userInputPatterns.userInputPatterns[key] || [key], // Usar patrones de entrada definidos o la clave como palabra clave
    response: getRandomResponse(knowledgeBase[key]) // Seleccionar una respuesta aleatoria del array de respuestas
  }));
  
  for (const entry of knowledgeEntries) {
    let maxScore = 0;
    
    // Evaluar cada palabra clave del patrón
    for (const keyword of entry.keywords) {
      const score = calculateMatchScore(userMessage, keyword);
      maxScore = Math.max(maxScore, score);
    }
    
    // Solo considerar coincidencias relevantes
    if (maxScore > 0.4) {
      scoredResponses.push({
        text: entry.response,
        score: maxScore * 0.9, // Ligeramente menor prioridad que FAQs específicas
        type: 'knowledge',
        key: entry.key // Guardar la clave para debugging
      });
    }
  }
  
  // 6. Verificar patrones de productos
  const productMatch = findProductMatch(userMessage);
  if (productMatch) {
    scoredResponses.push({
      text: productMatch.response,
      score: 0.85, // Alta prioridad para consultas de producto
      type: 'product'
    });
  }
  
  // 7. Buscar coincidencias con palabras clave específicas de tecnología
  const techKeywords = ['telefono', 'smartphone', 'celular', 'movil', 'tablet', 'ipad', 'laptop', 'notebook', 'computadora', 'pc'];
  const isTechQuery = techKeywords.some(keyword => normalizeText(userMessage).includes(keyword));
  
  if (isTechQuery) {
    // Si es una consulta de tecnología, agregar respuesta específica de tecnología
    scoredResponses.push({
      text: getRandomResponse(knowledgeBase.tecnologia),
      score: 0.85,
      type: 'tech'
    });
  }
  
  // 8. Detectar preguntas afirmativas o negativas para dar continuidad a la conversación
  const affirmativeKeywords = ['si', 'sí', 'claro', 'por supuesto', 'afirmativo', 'correcto', 'exacto', 'seguro', 'ok', 'vale'];
  const isAffirmative = affirmativeKeywords.some(keyword => normalizeText(userMessage).match(new RegExp(`\\b${keyword}\\b`)));
  
  if (isAffirmative && userMessage.trim().length < 10) {
    // Si la respuesta es afirmativa y corta, agregar sugerencia de acción
    scoredResponses.push({
      text: "¡Perfecto! ¿En qué más puedo ayudarte? Puedes preguntarme sobre productos específicos, métodos de pago, envíos, o cualquier otra duda que tengas.",
      score: 0.75,
      type: 'continuity'
    });
  }
  
  // 9. Aplicar ajustes de preferencias de usuario para personalizar respuestas
  applyUserPreferencesBoost(scoredResponses, userPreferences);
  
  // Si hay respuestas válidas, devolver la de mayor puntuación
  if (scoredResponses.length > 0) {
    // Ordenar por puntuación (de mayor a menor)
    scoredResponses.sort((a, b) => b.score - a.score);
    console.log('Top 3 respuestas candidatas:', scoredResponses.slice(0, 3));
    return scoredResponses[0].text;
  }
  
  // Si no hay coincidencias, devolver una respuesta genérica
  return getRandomResponse(chatResponses.mensajesGenericos.noEntiendo);
};

/**
 * Detecta la intención del usuario basada en patrones de entrada definidos
 */
function detectUserIntent(userMessage) {
  const normalizedMessage = normalizeText(userMessage);
  
  // Recorrer todas las categorías de patrones de entrada
  for (const category in userInputPatterns.userInputPatterns) {
    const patterns = userInputPatterns.userInputPatterns[category];
    
    // Buscar coincidencias con los patrones
    for (const pattern of patterns) {
      if (normalizedMessage.includes(normalizeText(pattern))) {
        return category; // Devolver la categoría como intención
      }
    }
  }
  
  return null; // No se identificó una intención clara
}

/**
 * Detecta si el usuario está preguntando por la hora actual
 */
function isTimeRequest(userMessage) {
  const normalizedMessage = normalizeText(userMessage);
  const timePatterns = [
    'que hora es', 'que hora son', 'hora actual', 'hora es', 
    'dime la hora', 'sabes la hora', 'me dices la hora'
  ];
  
  for (const pattern of timePatterns) {
    if (normalizedMessage.includes(pattern)) {
      return true;
    }
  }
  
  return false;
}

/**
 * Maneja la respuesta a una consulta de hora
 */
function handleTimeRequest() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const timeStr = `${hours}:${minutes}`;
  
  const responses = chatResponses.fechaHora.respuestaHora;
  let response = getRandomResponse(responses);
  return response.replace('{hora}', timeStr);
}

/**
 * Detecta si el usuario está preguntando por la fecha actual
 */
function isDateRequest(userMessage) {
  const normalizedMessage = normalizeText(userMessage);
  const datePatterns = [
    'que dia es', 'que fecha es', 'fecha de hoy', 'dia es hoy',
    'dime la fecha', 'cual es la fecha', 'a que dia estamos'
  ];
  
  for (const pattern of datePatterns) {
    if (normalizedMessage.includes(pattern)) {
      return true;
    }
  }
  
  return false;
}

/**
 * Maneja la respuesta a una consulta de fecha
 */
function handleDateRequest() {
  const now = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const dateStr = now.toLocaleDateString('es-ES', options);
  
  const responses = chatResponses.fechaHora.respuestaFecha;
  let response = getRandomResponse(responses);
  return response.replace('{fecha}', dateStr);
}

/**
 * Detecta si el usuario está dando las gracias
 */
function isThanksMessage(userMessage) {
  const normalizedMessage = normalizeText(userMessage);
  const thanksPatterns = [
    'gracias', 'te lo agradezco', 'muchas gracias', 'muy amable', 
    'thx', 'thanks', 'thank you', 'agradecido', 'te agradezco'
  ];
  
  for (const pattern of thanksPatterns) {
    if (normalizedMessage.includes(pattern)) {
      return true;
    }
  }
  
  return false;
}

/**
 * Detecta si el usuario está preguntando sobre garantías
 */
function isWarrantyRequest(userMessage) {
  const normalizedMessage = normalizeText(userMessage);
  const warrantyPatterns = [
    'garantia', 'garantias', 'garantizar', 'garantizan', 'garantizado', 
    'devolucion por garantia', 'warranty', 'tiene garantia', 'cuanto tiempo de garantia',
    'aplica garantia', 'como funciona la garantia'
  ];
  
  for (const pattern of warrantyPatterns) {
    if (normalizedMessage.includes(pattern)) {
      return true;
    }
  }
  
  return false;
}

/**
 * Determina el tipo de garantía según el producto mencionado
 */
function getWarrantyType(userMessage) {
  const normalizedMessage = normalizeText(userMessage);
  
  // Tecnología
  if (/celular|smartphone|laptop|notebook|computadora|pc|tablet|ipad|smartwatch|reloj inteligente|tecnologia|electronica/.test(normalizedMessage)) {
    return 'tecnologia';
  }
  
  // Electrodomésticos
  if (/electrodomestico|refrigerador|nevera|lavadora|secadora|horno|microondas|licuadora|batidora|cafetera|tostadora/.test(normalizedMessage)) {
    return 'electrodomesticos';
  }
  
  // Moda
  if (/ropa|camisa|pantalon|vestido|zapato|calzado|bolsa|cartera|moda|prenda|accesorio/.test(normalizedMessage)) {
    return 'moda';
  }
  
  // Muebles
  if (/mueble|sofa|sillon|mesa|silla|cama|escritorio|comedor|estante|librero|armario|closet/.test(normalizedMessage)) {
    return 'muebles';
  }
  
  return null; // Si no se identifica un tipo específico
}

/**
 * Calcula una puntuación basada en la coincidencia entre el mensaje del usuario y un texto de referencia
 * @returns Valor entre 0 y 1, donde 1 es coincidencia perfecta
 */
function calculateMatchScore(userMessage, referenceText) {
  // Normalizar ambos textos (minúsculas, sin acentos, etc.)
  const normalizedUserMessage = normalizeText(userMessage);
  const normalizedReferenceText = normalizeText(referenceText);
  
  // Dividir en tokens (palabras)
  const userTokens = normalizedUserMessage.split(/\s+/).filter(token => token.length > 2);
  const referenceTokens = normalizedReferenceText.split(/\s+/).filter(token => token.length > 2);
  
  // Si no hay suficientes tokens para comparar
  if (userTokens.length === 0 || referenceTokens.length === 0) {
    return 0;
  }
  
  // Contadores para el algoritmo de coincidencia
  let matchCount = 0;
  let partialMatchCount = 0;
  
  // Verificar coincidencias exactas y parciales
  for (const userToken of userTokens) {
    // Coincidencia exacta
    if (referenceTokens.includes(userToken)) {
      matchCount += 1;
      continue;
    }
    
    // Coincidencia parcial (una palabra es parte de la otra)
    for (const refToken of referenceTokens) {
      if (refToken.includes(userToken) || userToken.includes(refToken)) {
        // Calcular proporción de coincidencia
        const matchRatio = Math.min(userToken.length, refToken.length) / 
                          Math.max(userToken.length, refToken.length);
        
        // Solo contar si hay una coincidencia significativa
        if (matchRatio > 0.6) {
          partialMatchCount += matchRatio;
          break;
        }
      }
    }
  }
  
  // Calcular puntuación final
  // - Peso para coincidencias exactas
  const exactMatchWeight = 1.5;
  // - Peso para coincidencias parciales
  const partialMatchWeight = 0.7;
  
  // Fórmula de puntuación que considera:
  // 1. Proporción de palabras del usuario que coinciden
  // 2. Mayor importancia a coincidencias exactas vs. parciales
  const score = ((matchCount * exactMatchWeight) + (partialMatchCount * partialMatchWeight)) / 
               (userTokens.length * exactMatchWeight);
  
  // Bonificación si todas las palabras clave del usuario aparecen en la referencia
  if (matchCount === userTokens.length) {
    return Math.min(1, score * 1.2); // Bonus del 20% con límite máximo de 1
  }
  
  return Math.min(1, score);
}

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
 * Comprueba si un texto coincide con alguno de los patrones especificados
 */
function matchesPattern(text, patterns) {
  const normalizedText = normalizeText(text);
  
  for (const pattern of patterns) {
    if (normalizedText.includes(pattern)) {
      return true;
    }
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
 * Formatea la respuesta de un proceso paso a paso
 */
function formatProcessResponse(process) {
  let response = process.titulo + "\n";
  
  process.pasos.forEach((paso, index) => {
    response += `<br>${index + 1}. ${paso}`;
  });
  
  if (process.conclusion) {
    response += `<br><br>${process.conclusion}`;
  }
  
  return response;
}

/**
 * Formatea la respuesta de una información con listas
 */
function formatInfoResponse(info) {
  let response = info.titulo + "\n<br>";
  
  if (info.items) {
    info.items.forEach((item) => {
      response += `<br>• ${item}`;
    });
  } else if (info.secciones) {
    info.secciones.forEach((seccion) => {
      response += `<br>${seccion.subtitulo}<br>`;
      
      seccion.items.forEach((item) => {
        response += `• ${item}<br>`;
      });
    });
  }
  
  if (info.conclusion) {
    response += `<br>${info.conclusion}`;
  }
  
  return response;
}

/**
 * Función mejorada para detectar si un mensaje contiene solo emojis
 * Usa una regex compatible con todos los navegadores
 */
export function containsOnlyEmojis(text) {
  // La expresión regular incluye rangos Unicode para emojis comunes
  // y es compatible con distintos navegadores
  const emojiPattern = /^[\u{1F300}-\u{1F9FF}\u{2600}-\u{27BF}\u{2700}-\u{27BF}\u{2300}-\u{23FF}\u{2B50}\u{1F004}-\u{1F0CF}\u{1F170}-\u{1F251}❤\s]+$/u;
  
  // También verificamos manualmente emojis comunes para compatibilidad universal
  const commonEmojis = ['❤️', '👍', '👎', '😊', '😂', '🙏', '👋', '🤔', '😢', '😍', '🔥'];
  const trimmedText = text.trim();
  
  // Verificar si el texto es solo un emoji común
  if (commonEmojis.includes(trimmedText)) {
    return true;
  }
  
  // Para textos más largos, verificar si son solo múltiples emojis
  // Primero eliminamos espacios en blanco
  const textWithoutSpaces = trimmedText.replace(/\s/g, '');
  
  // Si el texto sin espacios es muy corto (4 caracteres o menos) y pasa la prueba de regex
  if (textWithoutSpaces.length <= 8 && emojiPattern.test(trimmedText)) {
    return true;
  }
  
  return false;
}

/**
 * Maneja las respuestas a mensajes que solo contienen emojis
 */
function handleEmojiResponse(emojiMessage) {
  // Respuestas específicas para emojis comunes
  if (emojiMessage.includes('❤️') || emojiMessage.includes('❤')) {
    return chatResponses.respuestasEmojis.corazon;
  }
  
  if (emojiMessage.includes('👍')) {
    return chatResponses.respuestasEmojis.pulgarArriba;
  }
  
  if (emojiMessage.includes('😊') || emojiMessage.includes('🙂') || emojiMessage.includes('😀')) {
    return chatResponses.respuestasEmojis.sonrisa;
  }
  
  if (emojiMessage.includes('🤔')) {
    return chatResponses.respuestasEmojis.pensando;
  }
  
  if (emojiMessage.includes('😢') || emojiMessage.includes('😭') || emojiMessage.includes('😔')) {
    return chatResponses.respuestasEmojis.triste;
  }
  
  if (emojiMessage.includes('😂') || emojiMessage.includes('🤣')) {
    return chatResponses.respuestasEmojis.risa;
  }
  
  // Respuesta genérica para otros emojis
  return chatResponses.respuestasEmojis.otrosEmojis;
}

/**
 * Encuentra coincidencias relacionadas con productos en el mensaje del usuario
 */
function findProductMatch(userMessage) {
  const normalizedMessage = normalizeText(userMessage);
  
  // Detectar patrones relacionados con ofertas y descuentos
  const offerPatterns = ['oferta', 'descuento', 'promocion', 'rebaja', 'liquidacion', 'sale'];
  const hasOfferIntent = offerPatterns.some(pattern => normalizedMessage.includes(pattern));
  
  if (hasOfferIntent) {
    // Devolver directamente el patrón de ofertas
    const offerPattern = productPatterns.find(pattern => pattern.category === 'ofertas');
    if (offerPattern) return offerPattern;
  }
  
  for (const pattern of productPatterns) {
    // Convertir la expresión regular en array de palabras clave
    const keywords = pattern.regex.split('|');
    let matchScore = 0;
    
    // Verificar coincidencias con las palabras clave del patrón
    for (const keyword of keywords) {
      if (normalizedMessage.includes(normalizeText(keyword))) {
        matchScore += 1;
      }
    }
    
    // Si hay suficientes coincidencias, considerar como match
    if (matchScore >= Math.min(2, keywords.length)) {
      return pattern;
    }
  }
  
  return null;
}

/**
 * Obtiene palabras clave relevantes según el tipo de proceso
 */
function getProcessKeywords(processKey) {
  switch (processKey) {
    case 'compra':
      return ['comprar', 'compra', 'como comprar', 'proceso de compra', 'pago', 'adquirir'];
    case 'devolucion':
      return ['devolver', 'devolucion', 'reembolso', 'retornar', 'regresar producto'];
    case 'seguimiento':
      return ['seguimiento', 'rastrear', 'envio', 'paquete', 'donde esta mi pedido', 'tracking'];
    case 'cambio':
      return ['cambiar', 'cambio', 'sustituir', 'reemplazar', 'intercambiar'];
    case 'cuenta':
      return ['cuenta', 'registrar', 'registrarme', 'perfil', 'crear cuenta'];
    default:
      return [processKey];
  }
}

/**
 * Obtiene palabras clave relevantes según el tipo de información
 */
function getInfoKeywords(infoKey) {
  switch (infoKey) {
    case 'metodosPago':
      return ['metodos de pago', 'pagar', 'formas de pago', 'tarjeta', 'efectivo', 'transferencia'];
    case 'envios':
      return ['envio', 'envios', 'tiempo de entrega', 'costo de envio', 'entrega', 'shipping'];
    case 'garantias':
      return ['garantia', 'devolucion', 'cambio', 'reparacion', 'producto defectuoso'];
    case 'horarios':
      return ['horario', 'horas', 'atencion', 'cuando abren', 'horario de atencion'];
    default:
      return [infoKey];
  }
}

/**
 * Ajusta puntuaciones basadas en preferencias del usuario
 */
function applyUserPreferencesBoost(scoredResponses, userPreferences) {
  if (!userPreferences) return;
  
  for (const response of scoredResponses) {
    // Boost para categoría preferida
    if (userPreferences.preferredCategory && 
        response.text.toLowerCase().includes(userPreferences.preferredCategory.toLowerCase())) {
      response.score *= 1.15; // 15% boost
    }
    
    // Boost para interés en envíos
    if (userPreferences.interestedInShipping && 
        (response.text.toLowerCase().includes('envío') || 
         response.text.toLowerCase().includes('entrega'))) {
      response.score *= 1.2; // 20% boost
    }
  }
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
 * Genera una respuesta basada en búsqueda de productos con recomendaciones específicas
 */
export function generateSearchResponse(searchText, categories) {
  const normalizedSearch = normalizeText(searchText);
  
  // Detectar categorías mencionadas
  let matchedCategory = null;
  
  for (const category of categories) {
    if (normalizedSearch.includes(normalizeText(category.name))) {
      matchedCategory = category;
      break;
    }
  }

  // Buscar productos relevantes en el catálogo
  const relevantProducts = findRelevantProducts(normalizedSearch);
  
  if (matchedCategory) {
    if (relevantProducts.length > 0) {
      // Si encontramos productos específicos en la categoría
      return createProductRecommendationResponse(matchedCategory, relevantProducts);
    }
    
    return `He encontrado productos en la categoría ${matchedCategory.name}. <a href="/products?category=${matchedCategory.id}" class="chatLink">Haz clic aquí para ver los resultados</a>.<br><br>¿Buscas algún producto específico dentro de ${matchedCategory.name}?`;
  }
  
  // Si no hay categoría pero hay productos relevantes
  if (relevantProducts.length > 0) {
    return createProductRecommendationResponse(null, relevantProducts);
  }
  
  // Si no hay categoría, realizar búsqueda general
  return `He buscado "${searchText}". <a href="/products?search=${encodeURIComponent(searchText)}" class="chatLink">Haz clic aquí para ver los resultados</a>.<br><br>¿Quieres que te ayude a filtrar estos resultados?`;
}

/**
 * Busca productos en el catálogo que coincidan con la consulta
 */
function findRelevantProducts(searchQuery) {
  const query = normalizeText(searchQuery);
  const matchedProducts = [];
  
  for (const product of productsData) {
    // Buscar en nombre, descripción y tags
    const productName = normalizeText(product.name);
    const productDesc = normalizeText(product.description);
    const productLongDesc = product.longDescription ? normalizeText(product.longDescription) : '';
    const productTags = product.tags ? product.tags.map(tag => normalizeText(tag)).join(' ') : '';
    
    const searchContent = `${productName} ${productDesc} ${productLongDesc} ${productTags}`;
    
    // Calcular puntuación de relevancia
    const score = calculateSearchRelevance(query, searchContent);
    
    if (score > 0.3) {
      matchedProducts.push({
        product,
        score
      });
    }
  }
  
  // Ordenar por relevancia y limitar a 3 productos
  return matchedProducts
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(match => match.product);
}

/**
 * Calcula la relevancia de un producto para una búsqueda
 */
function calculateSearchRelevance(query, productContent) {
  const queryTerms = query.split(/\s+/).filter(term => term.length > 2);
  
  if (queryTerms.length === 0) return 0;
  
  let matchCount = 0;
  
  for (const term of queryTerms) {
    if (productContent.includes(term)) {
      matchCount++;
    }
  }
  
  return matchCount / queryTerms.length;
}

/**
 * Crea una respuesta personalizada con recomendaciones de productos
 */
function createProductRecommendationResponse(category, products) {
  let response = '';
  
  if (category) {
    response += `He encontrado algunos productos de ${category.name} que podrían interesarte:<br><br>`;
  } else {
    response += `He encontrado estos productos que podrían interesarte:<br><br>`;
  }
  
  products.forEach((product, index) => {
    response += `<strong>${index + 1}. ${product.name}</strong> - $${product.price.toFixed(2)}`;
    
    if (product.discount) {
      response += ` <span style="color: #e63946">(${product.discount}% descuento)</span>`;
    }
    
    response += `<br>${product.description}<br>`;
    
    // Añadir especificaciones clave si están disponibles
    if (product.specifications) {
      const specs = Object.entries(product.specifications).slice(0, 3);
      if (specs.length > 0) {
        response += '<ul style="margin: 5px 0 10px 20px; padding: 0">';
        specs.forEach(([key, value]) => {
          response += `<li>${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}</li>`;
        });
        response += '</ul>';
      }
    }
    
    response += `<a href="/product/${product.id}" class="chatLink">Ver detalles</a><br><br>`;
  });
  
  if (category) {
    response += `<a href="/products?category=${category.id}" class="chatLink">Ver todos los productos de ${category.name}</a>`;
  } else {
    response += `¿Deseas que te recomiende productos similares o de alguna categoría específica?`;
  }
  
  return response;
}

/**
 * Devuelve una respuesta específica con garantía según el tipo de producto
 */
export function getSpecificWarrantyResponse(productType) {
  // Buscar productos de ese tipo
  const relevantProducts = findProductsByType(productType);
  let warrantyInfo = '';
  
  if (chatResponses.garantias[productType]) {
    warrantyInfo = chatResponses.garantias[productType];
  } else {
    warrantyInfo = "Todos nuestros productos cuentan con garantía del fabricante. El período específico varía según el tipo de producto.";
  }
  
  let response = `${warrantyInfo}<br><br>`;
  
  // Añadir ejemplos específicos de productos
  if (relevantProducts.length > 0) {
    response += `Algunos ejemplos de nuestros productos de ${productType}:<br><br>`;
    
    relevantProducts.forEach((product, index) => {
      response += `<strong>${product.name}</strong>: ${product.description}<br>`;
      
      // Si hay información específica de garantía en el producto
      if (product.specifications && product.specifications.garantia) {
        response += `<em>Garantía: ${product.specifications.garantia}</em><br>`;
      }
      
      if (index < relevantProducts.length - 1) {
        response += "<br>";
      }
    });
  }
  
  return response;
}

/**
 * Encuentra productos por tipo/categoría
 */
function findProductsByType(productType) {
  const categoryMapping = {
    'tecnologia': ['electronica', 'tecnología'],
    'electrodomesticos': ['electrodomestico', 'hogar'],
    'moda': ['moda', 'ropa', 'joyeria'],
    'muebles': ['mueble', 'hogar']
  };
  
  const categories = categoryMapping[productType] || [productType];
  
  return productsData
    .filter(product => {
      // Verificar si la categoría del producto coincide con alguna de las categorías relevantes
      if (categories.some(cat => normalizeText(product.category) === normalizeText(cat))) {
        return true;
      }
      
      // También verificar en tags
      if (product.tags && product.tags.some(tag => 
        categories.some(cat => normalizeText(tag).includes(normalizeText(cat))))) {
        return true;
      }
      
      return false;
    })
    .slice(0, 2); // Limitar a 2 productos de ejemplo
}

/**
 * Detecta consultas sobre disponibilidad de productos
 */
export function isProductAvailabilityQuery(userMessage) {
  const normalizedMessage = normalizeText(userMessage);
  const availabilityPatterns = [
    'tienen', 'hay', 'disponible', 'stock', 'existencia', 'queda', 'quedan',
    'venden', 'disponibilidad', 'conseguir', 'encontrar', 'busco'
  ];
  
  // Verificar patrones de disponibilidad
  if (availabilityPatterns.some(pattern => normalizedMessage.includes(pattern))) {
    // Buscar coincidencias con productos
    for (const product of productsData) {
      const productName = normalizeText(product.name);
      
      // Si el mensaje contiene el nombre del producto o palabras clave de sus tags
      if (normalizedMessage.includes(productName) || 
          (product.tags && product.tags.some(tag => normalizedMessage.includes(normalizeText(tag))))) {
        return { isAvailability: true, product };
      }
    }
    
    // Verificar coincidencias por categoría
    for (const pattern of productPatterns) {
      const keywords = pattern.regex.split('|');
      
      // Si el mensaje contiene alguna palabra clave de la categoría
      if (keywords.some(keyword => normalizedMessage.includes(normalizeText(keyword)))) {
        return { isAvailability: true, category: pattern.category };
      }
    }
  }
  
  return { isAvailability: false };
}

/**
 * Genera una respuesta para consultas de disponibilidad de productos
 */
export function getAvailabilityResponse(query) {
  if (query.product) {
    // Respuesta para un producto específico
    const product = query.product;
    
    if (product.stock > 10) {
      return `¡Sí! Tenemos <strong>${product.name}</strong> disponible en stock (${product.stock} unidades). Precio: $${product.price.toFixed(2)}${product.discount ? ` con ${product.discount}% de descuento` : ''}. <a href="/product/${product.id}" class="chatLink">Ver detalles</a>`;
    } else if (product.stock > 0) {
      return `¡Buenas noticias! Todavía nos quedan ${product.stock} unidades de <strong>${product.name}</strong>. Te recomendamos realizar tu compra pronto. Precio: $${product.price.toFixed(2)}${product.discount ? ` con ${product.discount}% de descuento` : ''}. <a href="/product/${product.id}" class="chatLink">Ver detalles</a>`;
    } else {
      return `Lo sentimos, actualmente no tenemos <strong>${product.name}</strong> en stock. Puedes registrarte en la página del producto para recibir una notificación cuando esté disponible. <a href="/product/${product.id}" class="chatLink">Ver detalles</a>`;
    }
  } else if (query.category) {
    // Respuesta para una categoría
    const categoryProducts = findProductsByCategory(query.category);
    
    if (categoryProducts.length > 0) {
      let response = `Sí, tenemos varios productos en la categoría ${query.category}. Algunos ejemplos son:<br><br>`;
      
      categoryProducts.slice(0, 3).forEach((product, index) => {
        response += `<strong>${index + 1}. ${product.name}</strong> - $${product.price.toFixed(2)}`;
        
        if (product.discount) {
          response += ` <span style="color: #e63946">(${product.discount}% descuento)</span>`;
        }
        
        response += `<br>${product.description}<br>`;
        
        if (product.stock > 0) {
          response += `<em>Disponible: ${product.stock} en stock</em><br>`;
        } else {
          response += `<em>Temporalmente sin stock</em><br>`;
        }
        
        response += `<a href="/product/${product.id}" class="chatLink">Ver detalles</a><br><br>`;
      });
      
      response += `<a href="/products?category=${query.category}" class="chatLink">Ver todos los productos de ${query.category}</a>`;
      
      return response;
    } else {
      return `Actualmente no tenemos información sobre productos en la categoría ${query.category}. ¿Puedo ayudarte a encontrar algo más?`;
    }
  }
  
  return null;
}

/**
 * Encuentra productos por categoría
 */
function findProductsByCategory(category) {
  return productsData
    .filter(product => normalizeText(product.category) === normalizeText(category) || 
                        normalizeText(product.category).includes(normalizeText(category)))
    .sort((a, b) => b.stock - a.stock) // Ordenar por stock disponible
    .slice(0, 4); // Limitar a 4 productos
}

/**
 * Genera sugerencias predictivas basadas en el texto de entrada del usuario
 */
export function generatePredictiveSuggestions(inputText, categories = [], recentSearches = []) {
  if (!inputText || inputText.trim().length < 2) {
    return [];
  }
  
  const normalizedInput = normalizeText(inputText).toLowerCase();
  const suggestions = [];
  
  // Frases comunes que usaríamos como predictivas
  const commonPhrases = [
    "¿Cómo puedo realizar una compra?",
    "¿Cuáles son los métodos de pago disponibles?",
    "¿Cuánto tiempo tarda el envío?",
    "¿Tienen envío gratuito?",
    "¿Cómo puedo rastrear mi pedido?",
    "¿Cuál es la política de devoluciones?",
    "¿Tienen sucursales físicas?",
    "¿Cuál es el horario de atención al cliente?",
    "¿Tienen descuentos o promociones?",
    "¿Cómo puedo contactarlos?",
    "¿Tienen productos en oferta?",
    "¿Necesito una cuenta para comprar?",
    "¿Cómo cambio mi contraseña?",
    "¿Tienen servicio de atención postventa?",
    "¿Ofrecen garantía en los productos?"
  ];
  
  // 1. Buscar en frases comunes
  for (const phrase of commonPhrases) {
    if (normalizeText(phrase).toLowerCase().includes(normalizedInput)) {
      suggestions.push(phrase);
      if (suggestions.length >= 5) break;
    }
  }
  
  // 2. Buscar coincidencias en categorías
  if (suggestions.length < 5 && Array.isArray(categories) && categories.length > 0) {
    for (const category of categories) {
      if (category && typeof category === 'object' && category.name) {
        const categoryName = category.name;
        if (normalizeText(categoryName).toLowerCase().includes(normalizedInput)) {
          suggestions.push(`Ver productos de ${categoryName}`);
          if (suggestions.length >= 5) break;
        }
      }
    }
  }
  
  // 3. Buscar en búsquedas recientes del usuario
  if (suggestions.length < 5 && Array.isArray(recentSearches) && recentSearches.length > 0) {
    for (const search of recentSearches) {
      if (normalizeText(search).toLowerCase().includes(normalizedInput)) {
        suggestions.push(search);
        if (suggestions.length >= 5) break;
      }
    }
  }
  
  // 4. Crear sugerencias de ayuda basadas en la entrada
  if (suggestions.length < 3) {
    suggestions.push(`Buscar "${inputText}"`);
    suggestions.push(`Información sobre ${inputText}`);
  }
  
  // Eliminar duplicados y limitar número de sugerencias
  return [...new Set(suggestions)].slice(0, 5);
}

/**
 * Renderiza HTML seguro para la respuesta
 */
export const renderHTML = (html) => {
  return { __html: html };
};

/**
 * Formatea la hora para mostrar en los mensajes
 */
export const formatTime = (timestamp) => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  let hours = date.getHours();
  let minutes = date.getMinutes();
  
  // Añadir cero inicial si es necesario
  hours = hours < 10 ? `0${hours}` : hours;
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  
  return `${hours}:${minutes}`;
};

/**
 * Detecta si el usuario está solicitando recomendaciones basadas en presupuesto
 */
export function isBudgetQuery(userMessage) {
  const normalizedMessage = normalizeText(userMessage);
  
  // Patrones para detectar consultas de presupuesto
  const budgetPatterns = [
    'presupuesto', 'gastar', 'invertir', 'cuestan', 'cuesta', 'precio', 
    'economico', 'barato', 'costoso', 'gama alta', 'gama baja', 'gama media'
  ];
  
  // Verificar si contiene algún patrón de presupuesto
  const hasBudgetPattern = budgetPatterns.some(pattern => 
    normalizedMessage.includes(pattern)
  );
  
  if (!hasBudgetPattern) return { isBudget: false };
  
  // Buscar si menciona un monto específico
  const moneyRegex = /(\d+)(\s*)(peso|dolar|euro|\$|usd|eur)/i;
  const moneyMatch = normalizedMessage.match(moneyRegex);
  
  let budget = 0;
  
  if (moneyMatch) {
    budget = parseInt(moneyMatch[1]);
  }
  
  // Detectar si menciona alguna categoría específica
  let category = null;
  
  for (const pattern of productPatterns) {
    const keywords = pattern.regex.split('|');
    if (keywords.some(keyword => normalizedMessage.includes(normalizeText(keyword)))) {
      category = pattern.category;
      break;
    }
  }
  
  return { 
    isBudget: true, 
    budget: budget,
    category: category
  };
}

/**
 * Genera recomendaciones basadas en el presupuesto del usuario
 */
export function getBudgetRecommendations(query) {
  const { budget, category } = query;
  
  // Si no hay presupuesto especificado, usar recomendaciones generales
  let filteredProducts = [];
  
  // Filtrar por categoría si se ha especificado
  if (category) {
    filteredProducts = findProductsByCategory(category);
  } else {
    // Si no hay categoría, mostrar productos destacados o con descuento
    filteredProducts = productsData.filter(product => product.featured || product.discount);
  }
  
  // Si hay presupuesto, filtrar por precio
  if (budget > 0) {
    filteredProducts = filteredProducts.filter(product => {
      // Calcular precio con descuento si aplica
      let finalPrice = product.price;
      if (product.discount) {
        finalPrice = product.price * (1 - product.discount / 100);
      }
      return finalPrice <= budget;
    });
    
    // Ordenar del más caro al más barato dentro del presupuesto para maximizar valor
    filteredProducts.sort((a, b) => {
      const priceA = a.price * (1 - (a.discount || 0) / 100);
      const priceB = b.price * (1 - (b.discount || 0) / 100);
      return priceB - priceA;
    });
  } else {
    // Sin presupuesto, ordenar por descuento/featured
    filteredProducts.sort((a, b) => {
      // Priorizar productos con descuento
      if (a.discount && !b.discount) return -1;
      if (!a.discount && b.discount) return 1;
      if (a.discount && b.discount) return b.discount - a.discount;
      
      // Luego por featured
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      
      return 0;
    });
  }
  
  // Limitar a 3 productos para la respuesta
  const recommendedProducts = filteredProducts.slice(0, 3);
  
  if (recommendedProducts.length === 0) {
    if (budget > 0) {
      return `Lo siento, no encontré productos ${category ? `de ${category} ` : ''}que se ajusten a tu presupuesto de $${budget}. ¿Te gustaría ver otras categorías o aumentar tu presupuesto?`;
    } else {
      return `No he encontrado productos ${category ? `de ${category}` : ''} para recomendarte. ¿Puedo ayudarte a buscar en otra categoría?`;
    }
  }
  
  let response = '';
  
  if (budget > 0) {
    response += `He encontrado estas recomendaciones ${category ? `de ${category} ` : ''}dentro de tu presupuesto de $${budget}:<br><br>`;
  } else if (category) {
    response += `Te recomiendo estos productos destacados de ${category}:<br><br>`;
  } else {
    response += `Estas son mis recomendaciones destacadas y ofertas actuales:<br><br>`;
  }
  
  recommendedProducts.forEach((product, index) => {
    // Calcular precio con descuento si aplica
    let finalPrice = product.price;
    let savings = 0;
    
    if (product.discount) {
      savings = product.price * (product.discount / 100);
      finalPrice = product.price - savings;
    }
    
    response += `<strong>${index + 1}. ${product.name}</strong> `;
    
    if (product.discount) {
      response += `- <span style="text-decoration: line-through;">$${product.price.toFixed(2)}</span> `;
      response += `<span style="color: #e63946; font-weight: bold;">$${finalPrice.toFixed(2)}</span> `;
      response += `<span style="color: #e63946;">(${product.discount}% descuento - ahorras $${savings.toFixed(2)})</span>`;
    } else {
      response += `- <strong>$${product.price.toFixed(2)}</strong>`;
      if (product.featured) {
        response += ` <span style="color: #2a9d8f;">⭐ Producto destacado</span>`;
      }
    }
    
    response += `<br>${product.description}<br>`;
    
    // Añadir especificaciones clave
    if (product.specifications) {
      const specs = Object.entries(product.specifications).slice(0, 3);
      if (specs.length > 0) {
        response += '<ul style="margin: 5px 0 10px 20px; padding: 0">';
        specs.forEach(([key, value]) => {
          response += `<li>${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}</li>`;
        });
        response += '</ul>';
      }
    }
    
    // Información de stock
    if (product.stock > 10) {
      response += `<span style="color: #2a9d8f;">✓ Disponible (${product.stock} unidades)</span><br>`;
    } else if (product.stock > 0) {
      response += `<span style="color: #e9c46a;">⚠️ Quedan pocas unidades (${product.stock})</span><br>`;
    } else {
      response += `<span style="color: #e63946;">✗ Agotado temporalmente</span><br>`;
    }
    
    response += `<a href="/product/${product.id}" class="chatLink">Ver detalles</a><br><br>`;
  });
  
  if (category) {
    response += `<a href="/products?category=${category}" class="chatLink">Ver todos los productos de ${category}</a>`;
  } else if (budget > 0) {
    response += `<a href="/products?maxPrice=${budget}" class="chatLink">Ver todos los productos dentro de tu presupuesto</a>`;
  } else {
    response += `<a href="/products?onSale=true" class="chatLink">Ver todas las ofertas</a>`;
  }
  
  if (budget > 0) {
    response += `<br><br>¿Te gustaría ver opciones en otra categoría o con un presupuesto diferente?`;
  } else {
    response += `<br><br>¿Puedo ayudarte a encontrar algo más específico?`;
  }
  
  return response;
}

/**
 * Detecta la categoría preferida del usuario basado en el historial de mensajes proporcionado
 */
export function detectUserPreferredCategory(messages) {
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return null;
  }
  
  // Análisis de mensajes del usuario para determinar interés en categorías
  const userMessages = messages.filter(msg => msg.sender === 'user');
  
  // Si no hay suficientes mensajes del usuario, no podemos determinar preferencias
  if (userMessages.length < 3) {
    return null;
  }
  
  // Mapeo de categorías a patrones de palabras clave
  const categoryPatterns = {
    'tecnologia': ['celular', 'smartphone', 'laptop', 'computadora', 'tecnologia', 'electronica', 'gadget'],
    'moda': ['ropa', 'zapato', 'vestido', 'camiseta', 'moda', 'accesorio', 'cartera'],
    'hogar': ['mueble', 'cocina', 'decoracion', 'hogar', 'casa', 'jardin', 'electrodomestico'],
    'deportes': ['deporte', 'fitness', 'gimnasio', 'bicicleta', 'futbol', 'running', 'entrenamiento'],
    'belleza': ['maquillaje', 'cosmetico', 'perfume', 'crema', 'belleza', 'cuidado', 'facial']
  };
  
  // Contar menciones de cada categoría
  const categoryCounts = {};
  
  for (const category in categoryPatterns) {
    categoryCounts[category] = 0;
    const patterns = categoryPatterns[category];
    
    // Contar coincidencias en mensajes del usuario
    for (const message of userMessages) {
      const normalizedMessage = normalizeText(message.text);
      
      for (const pattern of patterns) {
        if (normalizedMessage.includes(normalizeText(pattern))) {
          categoryCounts[category] += 1;
          break; // Contar solo una vez por mensaje
        }
      }
    }
  }
  
  // Encontrar la categoría con más menciones
  let maxCategory = null;
  let maxCount = 0;
  
  for (const category in categoryCounts) {
    if (categoryCounts[category] > maxCount) {
      maxCount = categoryCounts[category];
      maxCategory = category;
    }
  }
  
  // Solo devolver si hay un mínimo de menciones
  return maxCount >= 2 ? maxCategory : null;
}