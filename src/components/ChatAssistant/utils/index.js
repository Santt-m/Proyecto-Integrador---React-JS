/**
 * Sistema Modular para el Asistente de Chat
 * 
 * Esta estructura modular organiza las funcionalidades del chatbot en módulos especializados:
 * 
 * 1. responseGenerators: Generación de respuestas personalizadas según las consultas del usuario
 * 2. patternDetectors: Algoritmos para detectar intenciones y patrones en mensajes
 * 3. utils: Funciones auxiliares y utilidades generales
 * 
 * El diseño modular facilita:
 * - Pruebas unitarias independientes
 * - Mejor mantenimiento del código
 * - Extensibilidad para agregar nuevas funcionalidades
 * - Reutilización en otros componentes de la aplicación
 */

// Importaciones de módulos
import { 
  determineResponse,
  generateSearchResponse,
  getBudgetRecommendations,
  getAvailabilityResponse,
  getSpecificWarrantyResponse
} from './responseGenerators';

import {
  isProductAvailabilityQuery,
  isBudgetQuery,
  detectUserIntent,
  detectUserPreferredCategory
} from './patternDetectors';

import {
  generatePredictiveSuggestions,
  optimizeMessageHistory,
  normalizeText,
  formatTime,
  renderHTML,
  containsOnlyEmojis,
  getRandomResponse
} from './utils';

// Exportación de funciones con documentación detallada

/**
 * GENERADORES DE RESPUESTAS
 * Módulo: responseGenerators.js
 * 
 * Estas funciones se especializan en construir respuestas para el chatbot
 * basadas en diferentes tipos de consultas y contextos.
 */

/**
 * Determina la respuesta más adecuada para un mensaje del usuario
 * @function determineResponse
 * @param {string} userMessage - Mensaje del usuario
 * @param {Object} userPreferences - Preferencias detectadas (ej. categoría preferida)
 * @returns {string} Respuesta HTML formateada
 * 
 * Lógica:
 * 1. Verifica si el mensaje está vacío o es demasiado corto
 * 2. Detecta la intención del usuario basándose en patrones
 * 3. Busca coincidencias en la base de conocimiento
 * 4. Busca coincidencias en las preguntas frecuentes (FAQs)
 * 5. Genera una respuesta basada en el contexto y preferencias
 */
export { determineResponse };

/**
 * Genera respuestas específicas para búsquedas de productos
 * @function generateSearchResponse
 * @param {string} searchText - Texto de búsqueda ingresado por el usuario
 * @param {Array} categories - Lista de categorías disponibles
 * @returns {string} Respuesta con resultados de búsqueda y recomendaciones
 * 
 * Lógica:
 * 1. Normaliza el texto de búsqueda
 * 2. Detecta si se menciona alguna categoría específica
 * 3. Busca productos relevantes según términos de búsqueda
 * 4. Construye una respuesta con productos recomendados
 * 5. Incluye enlaces para ver más detalles o resultados completos
 */
export { generateSearchResponse };

/**
 * Genera recomendaciones de productos basadas en un presupuesto
 * @function getBudgetRecommendations
 * @param {Object} budgetQuery - Información sobre consulta de presupuesto
 * @param {boolean} budgetQuery.isBudget - Indica si es consulta de presupuesto
 * @param {number} budgetQuery.budget - Monto presupuestado
 * @returns {string} Respuesta HTML con productos recomendados
 * 
 * Lógica:
 * 1. Filtra productos dentro del presupuesto
 * 2. Ordena por relevancia (descuentos, valoraciones, precio)
 * 3. Agrupa por categorías para mejor organización
 * 4. Incluye precios, descuentos y disponibilidad
 * 5. Agrega enlaces para más opciones
 */
export { getBudgetRecommendations };

/**
 * Genera respuestas para consultas sobre disponibilidad de productos
 * @function getAvailabilityResponse
 * @param {Object} query - Consulta de disponibilidad
 * @returns {string} Respuesta sobre disponibilidad de productos
 * 
 * Lógica:
 * 1. Verifica si la consulta es sobre un producto específico o categoría
 * 2. Para productos específicos, muestra stock, precio y descuentos
 * 3. Para categorías, muestra productos disponibles en esa categoría
 * 4. Adapta el mensaje según nivel de stock (disponible, bajo, agotado)
 */
export { getAvailabilityResponse };

/**
 * Genera respuestas específicas sobre garantías de productos
 * @function getSpecificWarrantyResponse
 * @param {string} productType - Tipo de producto consultado
 * @returns {string} Información detallada sobre garantías
 * 
 * Lógica:
 * 1. Busca información de garantía específica para ese tipo de producto
 * 2. Incluye ejemplos de productos relevantes
 * 3. Agrega detalles de garantía específicos cuando están disponibles
 */
export { getSpecificWarrantyResponse };

/**
 * Obtiene una respuesta aleatoria de un conjunto de posibilidades
 * @function getRandomResponse
 * @param {Array<string>} responses - Array de posibles respuestas
 * @returns {string} Una respuesta aleatoria
 */
export { getRandomResponse };

/**
 * DETECTORES DE PATRONES
 * Módulo: patternDetectors.js
 * 
 * Estas funciones identifican patrones específicos e intenciones
 * en los mensajes del usuario utilizando técnicas de NLP.
 */

/**
 * Detecta si el mensaje es una consulta sobre disponibilidad de productos
 * @function isProductAvailabilityQuery
 * @param {string} userMessage - Mensaje del usuario
 * @returns {Object} Resultado del análisis
 * @returns {boolean} result.isAvailability - Indica si es consulta de disponibilidad
 * @returns {Object} [result.product] - Producto detectado (si aplica)
 * @returns {string} [result.category] - Categoría detectada (si aplica)
 * 
 * Lógica:
 * 1. Normaliza el mensaje y busca patrones de disponibilidad
 * 2. Verifica si hay menciones específicas de productos
 * 3. Busca coincidencias con nombres de categorías
 */
export { isProductAvailabilityQuery };

/**
 * Detecta si el mensaje contiene una consulta de presupuesto
 * @function isBudgetQuery
 * @param {string} userMessage - Mensaje del usuario
 * @returns {Object} Resultado del análisis
 * @returns {boolean} result.isBudget - Indica si es consulta de presupuesto
 * @returns {number} [result.budget] - Monto del presupuesto (si aplica)
 * 
 * Lógica:
 * 1. Utiliza expresiones regulares para detectar patrones de presupuesto
 * 2. Extrae el valor numérico del presupuesto
 * 3. Verifica diferentes formatos (con símbolo de moneda, con texto, etc.)
 */
export { isBudgetQuery };

/**
 * Detecta la intención principal del usuario
 * @function detectUserIntent
 * @param {string} userMessage - Mensaje del usuario
 * @returns {string|null} Intención detectada o null si no se identifica
 * 
 * Lógica:
 * 1. Normaliza el mensaje y lo compara con patrones predefinidos
 * 2. Utiliza un sistema de puntuación para determinar la coincidencia más probable
 * 3. Aplica diferentes técnicas de coincidencia (exacta, parcial, palabras clave)
 * 4. Devuelve la intención con mayor puntuación si supera un umbral
 */
export { detectUserIntent };

/**
 * Detecta la categoría de productos preferida por el usuario
 * @function detectUserPreferredCategory
 * @param {Array} messages - Historial de mensajes
 * @returns {string|null} Categoría preferida o null si no se identifica
 * 
 * Lógica:
 * 1. Analiza el historial de mensajes del usuario
 * 2. Contabiliza menciones de categorías usando patrones predefinidos
 * 3. Verifica coincidencias con nombres directos de categorías
 * 4. Devuelve la categoría más mencionada como preferencia
 */
export { detectUserPreferredCategory };

/**
 * UTILIDADES GENERALES
 * Módulo: utils.js
 * 
 * Funciones auxiliares usadas por diversos componentes del sistema.
 */

/**
 * Genera sugerencias predictivas basadas en el texto ingresado
 * @function generatePredictiveSuggestions
 * @param {string} inputText - Texto ingresado por el usuario
 * @param {Array} categories - Categorías disponibles
 * @param {Array} recentSearches - Búsquedas recientes del usuario
 * @param {Object} userPreferences - Preferencias detectadas
 * @param {Array} messages - Historial de mensajes
 * @returns {Array<string>} Lista de sugerencias generadas
 * 
 * Lógica:
 * 1. Analiza el texto ingresado y lo normaliza
 * 2. Busca coincidencias con preguntas frecuentes
 * 3. Considera preferencias y categorías de interés
 * 4. Genera sugerencias contextuales basadas en el historial
 */
export { generatePredictiveSuggestions };

/**
 * Optimiza el historial de mensajes para conversaciones largas
 * @function optimizeMessageHistory
 * @param {Array} messages - Historial completo de mensajes
 * @param {number} [maxLength=50] - Número máximo de mensajes a mantener
 * @returns {Array} Historial optimizado
 * 
 * Lógica:
 * 1. Mantiene el primer mensaje (bienvenida)
 * 2. Conserva los mensajes más recientes
 * 3. Elimina mensajes intermedios para optimizar rendimiento
 */
export { optimizeMessageHistory };

/**
 * Normaliza texto para comparaciones (elimina acentos, etc.)
 * @function normalizeText
 * @param {string} text - Texto a normalizar
 * @returns {string} Texto normalizado
 */
export { normalizeText };

/**
 * Formatea marcas de tiempo para mostrarlas en el chat
 * @function formatTime
 * @param {number|Date} timestamp - Marca de tiempo
 * @returns {string} Hora formateada (HH:MM)
 */
export { formatTime };

/**
 * Renderiza contenido HTML de forma segura
 * @function renderHTML
 * @param {string} htmlContent - Contenido HTML
 * @returns {Object} Objeto para dangerouslySetInnerHTML
 * 
 * Lógica:
 * 1. Sanitiza el HTML para prevenir ataques XSS
 * 2. Permite solo tags seguros (a, br, strong, etc.)
 * 3. Reemplaza atributos potencialmente peligrosos
 */
export { renderHTML };

/**
 * Detecta si un mensaje contiene solo emojis
 * @function containsOnlyEmojis
 * @param {string} text - Texto a analizar
 * @returns {boolean} true si contiene solo emojis
 */
export { containsOnlyEmojis };