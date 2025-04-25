/**
 * Funciones especializadas en detectar patrones en los mensajes del usuario
 * Centraliza toda la lógica de detección de intenciones y consultas específicas
 */

import chatResponses from '../data/chatResponses.json';
import userInputPatterns from '../data/userInputPatterns.json';
import categoryData from '../data/categories.json';
import productsData from '../../../data/products.json';
import { normalizeText } from './utils';

/**
 * Detecta la intención del usuario basada en patrones de entrada
 * @param {string} userMessage - Mensaje del usuario
 * @returns {string|null} - La clave de intención detectada o null si no se encuentra
 */
export const detectUserIntent = (userMessage) => {
  // Si no hay mensaje, retornar null
  if (!userMessage || userMessage.trim().length === 0) {
    return null;
  }
  
  // Normalizar el mensaje (minúsculas, sin acentos, etc.)
  const normalizedMessage = normalizeText(userMessage.toLowerCase());
  
  // Cargar patrones de entrada desde archivo (importado previamente)
  const patterns = userInputPatterns.userInputPatterns;
  
  // Calcular puntuaciones para cada categoría
  const scores = {};
  
  // Para cada categoría en los patrones
  for (const category in patterns) {
    let maxScore = 0;
    const categoryPatterns = patterns[category];
    
    // Para cada patrón en la categoría
    for (const pattern of categoryPatterns) {
      // Calcular coincidencia con diferentes técnicas
      
      // 1. Coincidencia exacta
      if (normalizedMessage === pattern) {
        maxScore = Math.max(maxScore, 1.0); // Puntuación perfecta
        break; // No necesitamos seguir comprobando otros patrones
      }
      
      // 2. Contiene la frase exacta
      if (normalizedMessage.includes(pattern)) {
        // La puntuación depende de cuánto del mensaje original coincide
        const coverage = pattern.length / normalizedMessage.length;
        const patternScore = 0.7 + (0.3 * coverage);
        maxScore = Math.max(maxScore, patternScore);
      }
      
      // 3. Coincidencia de palabras clave (para frases)
      if (pattern.includes(' ')) {
        const patternWords = pattern.split(' ').filter(w => w.length > 3);
        let matchedWords = 0;
        
        for (const word of patternWords) {
          if (normalizedMessage.includes(word)) {
            matchedWords++;
          }
        }
        
        if (patternWords.length > 0 && matchedWords > 0) {
          const wordMatchScore = 0.5 * (matchedWords / patternWords.length);
          maxScore = Math.max(maxScore, wordMatchScore);
        }
      }
      
      // 4. Para palabras individuales, verificar si están en el mensaje
      if (!pattern.includes(' ') && pattern.length > 3) {
        // Verificar que sea una palabra completa, no parte de otra
        // Escapamos los caracteres especiales para evitar errores en la regex
        const safePattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        try {
          const regex = new RegExp(`\\b${safePattern}\\b`, 'i');
          if (regex.test(normalizedMessage)) {
            // Palabras clave más largas tienen más peso
            const lengthBonus = Math.min(0.2, pattern.length * 0.01);
            maxScore = Math.max(maxScore, 0.4 + lengthBonus);
          }
        } catch (e) {
          // Si hay un error en la regex, intentamos con una coincidencia simple
          if (normalizedMessage.includes(pattern)) {
            const lengthBonus = Math.min(0.2, pattern.length * 0.01);
            maxScore = Math.max(maxScore, 0.4 + lengthBonus);
          }
        }
      }
    }
    
    // Guardar puntuación para esta categoría
    if (maxScore > 0) {
      scores[category] = maxScore;
    }
  }
  
  // Si no se encontraron coincidencias, retornar null
  if (Object.keys(scores).length === 0) {
    return null;
  }
  
  // Encontrar la categoría con mayor puntuación
  let highestCategory = null;
  let highestScore = 0;
  
  for (const category in scores) {
    if (scores[category] > highestScore) {
      highestScore = scores[category];
      highestCategory = category;
    }
  }
  
  // Solo retornar la categoría si supera un umbral mínimo
  return highestScore >= 0.4 ? highestCategory : null;
};

/**
 * Detecta si el mensaje contiene una consulta de presupuesto
 * @param {string} userMessage - Mensaje del usuario
 * @returns {Object} - Objeto con información sobre presupuesto
 */
export function isBudgetQuery(userMessage) {
  const normalizedMessage = normalizeText(userMessage);
  
  // Patrones para detectar menciones de presupuesto
  const budgetPatterns = [
    /(?:tengo|con|de)\s+(?:un\s+)?(?:presupuesto\s+)?(?:de\s+)?[$]?(\d+[.,]?\d*)\s*(?:pesos|dolares|euros|\$)/i,
    /(?:hasta|máximo|maximo|max)\s+[$]?(\d+[.,]?\d*)\s*(?:pesos|dolares|euros|\$)?/i,
    /(?:[$]?(\d+[.,]?\d*)\s*(?:pesos|dolares|euros|\$)?)\s+(?:o menos|como máximo|como maximo|maximo|máximo)/i,
    /(?:gastar|invertir|pagar)\s+(?:hasta|máximo|maximo)?\s+[$]?(\d+[.,]?\d*)/i,
    /(?:[$](\d+[.,]?\d*))/
  ];
  
  for (const pattern of budgetPatterns) {
    const match = normalizedMessage.match(pattern);
    if (match && match[1]) {
      // Limpiar y convertir a número
      const budgetStr = match[1].replace(',', '.');
      const budget = parseFloat(budgetStr);
      
      if (!isNaN(budget) && budget > 0) {
        return {
          isBudget: true,
          budget: budget,
          originalMatch: match[0]
        };
      }
    }
  }
  
  // Verificar también patrones simples como "200 pesos" o "500 dólares"
  const simpleMatch = normalizedMessage.match(/(\d+[.,]?\d*)\s*(?:pesos|dolares|euros|\$|dolar)/i);
  if (simpleMatch && simpleMatch[1]) {
    const budgetStr = simpleMatch[1].replace(',', '.');
    const budget = parseFloat(budgetStr);
    
    if (!isNaN(budget) && budget > 0) {
      return {
        isBudget: true,
        budget: budget,
        originalMatch: simpleMatch[0]
      };
    }
  }
  
  return { isBudget: false };
}

/**
 * Detecta consultas sobre disponibilidad de productos
 */
export function isProductAvailabilityQuery(userMessage) {
  const normalizedMessage = normalizeText(userMessage);
  
  // Obtener patrones de disponibilidad desde el archivo JSON
  const availabilityPatterns = userInputPatterns.userInputPatterns.disponibilidadPatrones;
  
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
    for (const category of categoryData.categories || []) {
      if (normalizedMessage.includes(normalizeText(category.name))) {
        return { isAvailability: true, category: category.name };
      }
    }
  }
  
  return { isAvailability: false };
}

/**
 * Detecta la categoría preferida del usuario basado en el historial de mensajes
 * @param {Array} messages - Historial de mensajes del chat
 * @returns {string|null} - Nombre de la categoría preferida o null si no se detecta
 */
export function detectUserPreferredCategory(messages) {
  if (!Array.isArray(messages) || messages.length === 0) {
    return null;
  }
  
  // Obtener solo los mensajes del usuario
  const userMessages = messages
    .filter(msg => msg.sender === 'user')
    .map(msg => normalizeText(msg.text));
  
  if (userMessages.length === 0) {
    return null;
  }
  
  // Contador para categorías mencionadas
  const categoryCounts = {};
  const categoryPatterns = userInputPatterns.userInputPatterns;
  
  // Categorías a analizar
  const categoriesToCheck = [
    'tecnologia', 'moda', 'hogar', 'deportes', 
    'belleza', 'alimentos', 'joyeria', 'electrodomesticos'
  ];
  
  // Contabilizar menciones de cada categoría
  for (const category of categoriesToCheck) {
    if (categoryPatterns[category]) {
      let count = 0;
      
      for (const pattern of categoryPatterns[category]) {
        for (const message of userMessages) {
          if (message.includes(normalizeText(pattern))) {
            count++;
          }
        }
      }
      
      if (count > 0) {
        categoryCounts[category] = count;
      }
    }
  }
  
  // Verificar también coincidencias con nombres de categorías directamente
  const categories = categoryData.categories || [];
  for (const category of categories) {
    const categoryName = normalizeText(category.name);
    let count = 0;
    
    for (const message of userMessages) {
      if (message.includes(categoryName)) {
        count++;
      }
    }
    
    if (count > 0) {
      categoryCounts[categoryName] = (categoryCounts[categoryName] || 0) + count;
    }
  }
  
  // Encontrar la categoría con más menciones
  let preferredCategory = null;
  let maxCount = 0;
  
  for (const [category, count] of Object.entries(categoryCounts)) {
    if (count > maxCount) {
      maxCount = count;
      preferredCategory = category;
    }
  }
  
  return preferredCategory;
}