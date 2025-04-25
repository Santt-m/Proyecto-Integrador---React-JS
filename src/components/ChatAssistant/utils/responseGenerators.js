/**
 * Generadores de respuestas para el asistente de chat
 * Este módulo contiene funciones especializadas para generar respuestas
 * basadas en diferentes tipos de consultas del usuario
 */

import chatResponses from '../data/chatResponses.json';
import faqs from '../data/faqs.json';
import knowledgeBase from '../data/knowledgeBase.json';
import productsData from '../../../data/products.json';
import uiTexts from '../data/uiTexts.json';
import categoryData from '../data/categories.json'; 
import productPatterns from '../data/productPatterns.json';

import { normalizeText, getRandomResponse } from './utils';
import { detectUserIntent } from './patternDetectors';

/**
 * Determina la respuesta adecuada basada en el mensaje del usuario y sus preferencias
 * Utiliza un sistema de puntuación para priorizar respuestas relevantes
 * 
 * @param {string} userMessage - Mensaje del usuario
 * @param {Object} userPreferences - Preferencias del usuario basadas en historial
 * @returns {string} - Respuesta HTML formateada para el usuario
 */
export const determineResponse = (userMessage, userPreferences = {}) => {
  // Validar entrada para mensajes vacíos o muy cortos
  if (!userMessage || userMessage.trim() === '') {
    return chatResponses.mensajesGenericos.mensajeVacio;
  }
  
  if (userMessage.trim().length <= 2) {
    return chatResponses.mensajesGenericos.mensajeCorto;
  }

  // Para evitar sobrecargar este archivo, esta es una versión simplificada
  // La implementación completa debería incluir:
  // 1. Verificación de emojis, consultas de hora/fecha, identidad, etc.
  // 2. Sistema de scoring para FAQs y diferentes tipos de respuestas
  // 3. Matching de patrones de productos, garantías, etc.
  // 4. Aplicación de preferencias de usuario para personalizar respuestas

  // Usar patrones de entrada definidos para detectar intención
  const userIntent = detectUserIntent(userMessage);
  if (userIntent && knowledgeBase[userIntent]) {
    // Si encontramos una intención clara, devolver respuesta directa de knowledgeBase
    return getRandomResponse(knowledgeBase[userIntent]);
  }

  // Búsqueda en FAQs
  for (const faq of faqs) {
    // Verificar si hay coincidencia entre la pregunta del usuario y las FAQs
    if (normalizeText(userMessage).includes(normalizeText(faq.question)) ||
        faq.keywords.some(keyword => normalizeText(userMessage).includes(normalizeText(keyword)))) {
      return faq.answer;
    }
  }

  // Si no hay coincidencias, devolver una respuesta genérica
  return getRandomResponse(chatResponses.mensajesGenericos.noEntiendo);
};

/**
 * Genera recomendaciones basadas en el presupuesto del usuario
 * Filtra productos dentro del presupuesto y los ordena por relevancia
 * 
 * @param {Object} budgetQuery - Objeto con información del presupuesto
 * @returns {string} - Respuesta formateada con recomendaciones
 */
export function getBudgetRecommendations(budgetQuery) {
  if (!budgetQuery.isBudget || budgetQuery.budget <= 0) {
    return chatResponses.mensajesGenericos.noEntiendo;
  }
  
  const budget = budgetQuery.budget;
  
  // Filtrar productos dentro del presupuesto, priorizando los que tienen descuento
  let recommendedProducts = productsData.filter(product => {
    // Calcular precio con descuento si aplica
    let finalPrice = product.price;
    if (product.discount) {
      finalPrice = product.price * (1 - product.discount / 100);
    }
    
    // Solo incluir productos dentro del presupuesto
    return finalPrice <= budget;
  });
  
  // Ordenar por relevancia (descuento, rating, y precio cercano al máximo presupuesto)
  recommendedProducts.sort((a, b) => {
    // Priorizar productos con descuento
    const aHasDiscount = a.discount && a.discount > 0;
    const bHasDiscount = b.discount && b.discount > 0;
    
    if (aHasDiscount && !bHasDiscount) return -1;
    if (!aHasDiscount && bHasDiscount) return 1;
    
    // Si ambos tienen descuento, priorizar el de mayor descuento
    if (aHasDiscount && bHasDiscount && a.discount !== b.discount) {
      return b.discount - a.discount;
    }
    
    // Priorizar productos featured
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    
    // Si tienen la misma prioridad por descuentos, ordenar por rating
    if (a.rating !== b.rating) {
      return b.rating - a.rating;
    }
    
    // Finalmente, priorizar productos que aprovechen mejor el presupuesto
    return b.price - a.price;
  });
  
  // Limitar a máximo 4 productos para la respuesta
  recommendedProducts = recommendedProducts.slice(0, 4);
  
  // Si no hay productos, devolver mensaje correspondiente
  if (recommendedProducts.length === 0) {
    return uiTexts.productResponses.budget.noProductsFound.replace('{budget}', budget.toFixed(2));
  }
  
  // Comprobar si hay productos en oferta para destacarlos
  const hasDiscountedProducts = recommendedProducts.some(p => p.discount && p.discount > 0);
  
  // Construir respuesta
  let response = uiTexts.productResponses.budget.intro.replace('{budget}', budget.toFixed(2));
  
  // Agrupar productos por categoría para darle estructura a la respuesta
  const categorizedProducts = {};
  recommendedProducts.forEach(product => {
    if (!categorizedProducts[product.category]) {
      categorizedProducts[product.category] = [];
    }
    categorizedProducts[product.category].push(product);
  });
  
  // Agregar productos a la respuesta, agrupados por categoría
  for (const [category, products] of Object.entries(categorizedProducts)) {
    response += `<strong>${category.charAt(0).toUpperCase() + category.slice(1)}</strong>:<br>`;
    
    products.forEach(product => {
      // Calcular precio con descuento si aplica
      let finalPrice = product.price;
      let discountText = '';
      
      if (product.discount) {
        const discountedPrice = product.price * (1 - product.discount / 100);
        const savings = product.price - discountedPrice;
        
        discountText = uiTexts.productResponses.discount.show
          .replace('{discountedPrice}', discountedPrice.toFixed(2))
          .replace('{discountPercent}', product.discount)
          .replace('{savingsAmount}', savings.toFixed(2));
            
        finalPrice = discountedPrice;
      }
      
      response += `• <strong>${product.name}</strong> - $${finalPrice.toFixed(2)} ${discountText}`;
      
      if (product.featured) {
        response += uiTexts.productResponses.discount.featured;
      }
      
      response += `<br>`;
      response += `${product.description}<br>`;
      
      // Información de stock
      if (product.stock > 10) {
        response += uiTexts.productResponses.stock.available.replace('{stock}', product.stock);
      } else if (product.stock > 0) {
        response += uiTexts.productResponses.stock.lowStock.replace('{stock}', product.stock);
      } else {
        response += uiTexts.productResponses.stock.outOfStock;
      }
      
      response += `<a href="/product/${product.id}" class="chatLink">Ver detalles</a><br><br>`;
    });
  }
  
  // Agregar enlaces para ver todos los productos en ese rango de precio
  response += uiTexts.productResponses.budget.viewAllBudget.replace('{budget}', budget.toFixed(0));
  
  // Si hay productos en oferta, sugerir también ver todas las ofertas
  if (hasDiscountedProducts) {
    response += `<br>${uiTexts.productResponses.budget.viewAllOffers}`;
  }
  
  // Agregar pregunta de seguimiento
  response += uiTexts.productResponses.budget.moreOptions;
  
  return response;
}

/**
 * Genera una respuesta basada en búsqueda de productos con recomendaciones específicas
 * 
 * @param {string} searchText - Texto de búsqueda del usuario
 * @param {Array} categories - Categorías de productos disponibles
 * @returns {string} - Respuesta con resultados de búsqueda
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
 * @private
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
 * @private
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
 * @private
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
 * Genera una respuesta para consultas de disponibilidad de productos
 * 
 * @param {Object} query - Objeto con información de disponibilidad
 * @returns {string} - Respuesta formateada sobre disponibilidad
 */
export function getAvailabilityResponse(query) {
  if (query.product) {
    // Respuesta para un producto específico
    const product = query.product;
    
    if (product.stock > 10) {
      return uiTexts.productResponses.availability.inStock
        .replace('{productName}', product.name)
        .replace('{stock}', product.stock)
        .replace('{price}', product.price.toFixed(2))
        .replace('{discount}', product.discount ? uiTexts.productResponses.discount.withDiscount.replace('{discount}', product.discount) : '')
        .replace('{productId}', product.id);
    } else if (product.stock > 0) {
      return uiTexts.productResponses.availability.lowStock
        .replace('{productName}', product.name)
        .replace('{stock}', product.stock)
        .replace('{price}', product.price.toFixed(2))
        .replace('{discount}', product.discount ? uiTexts.productResponses.discount.withDiscount.replace('{discount}', product.discount) : '')
        .replace('{productId}', product.id);
    } else {
      return uiTexts.productResponses.availability.outOfStock
        .replace('{productName}', product.name)
        .replace('{productId}', product.id);
    }
  } else if (query.category) {
    // Respuesta para una categoría
    const categoryProducts = findProductsByCategory(query.category);
    
    if (categoryProducts.length > 0) {
      let response = uiTexts.productResponses.availability.categoryAvailable.replace('{category}', query.category);
      
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
      
      response += uiTexts.productResponses.availability.viewAllCategory
        .replace('{categoryId}', query.category)
        .replace('{category}', query.category);
      
      return response;
    } else {
      return uiTexts.productResponses.availability.noProducts.replace('{category}', query.category);
    }
  }
  
  return null;
}

/**
 * Encuentra productos por categoría
 * @private
 */
function findProductsByCategory(category) {
  return productsData
    .filter(product => normalizeText(product.category) === normalizeText(category) || 
                        normalizeText(product.category).includes(normalizeText(category)))
    .sort((a, b) => b.stock - a.stock) // Ordenar por stock disponible
    .slice(0, 4); // Limitar a 4 productos
}

/**
 * Devuelve una respuesta específica con garantía según el tipo de producto
 * 
 * @param {string} productType - Tipo de producto
 * @returns {string} - Respuesta formateada con información de garantía
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
 * @private
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