// src/services/api.js
import productsData from '../data/products.json';

/**
 * Servicio centralizado para acceder a los datos
 * Más adelante esto podría cambiarse para usar fetch o axios 
 * para obtener datos de una API real
 */

/**
 * Obtiene todos los productos
 * @returns {Promise} Promesa que resuelve a un array de productos
 */
export const getAllProducts = () => {
  return new Promise((resolve) => {
    // Simulamos un delay como si fuera una API real
    setTimeout(() => {
      resolve(productsData);
    }, 300);
  });
};

/**
 * Obtiene un producto por su ID
 * @param {number} id - ID del producto a buscar
 * @returns {Promise} Promesa que resuelve a un objeto producto o null si no existe
 */
export const getProductById = (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const product = productsData.find(p => p.id === parseInt(id, 10)) || null;
      resolve(product);
    }, 300);
  });
};

/**
 * Obtiene productos destacados
 * @param {number} limit - Número máximo de productos a retornar
 * @returns {Promise} Promesa que resuelve a un array de productos destacados
 */
export const getFeaturedProducts = (limit = 3) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Filtramos productos que tengan la propiedad featured como true
      const featured = productsData.filter(p => p.featured).slice(0, limit);
      resolve(featured);
    }, 300);
  });
};

/**
 * Obtiene productos relacionados a un producto por su categoría
 * @param {number} productId - ID del producto de referencia
 * @param {number} limit - Número máximo de productos a retornar
 * @returns {Promise} Promesa que resuelve a un array de productos relacionados
 */
export const getRelatedProducts = (productId, limit = 3) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const currentProduct = productsData.find(p => p.id === parseInt(productId, 10));
      
      if (!currentProduct) {
        resolve([]);
        return;
      }
      
      const related = productsData
        .filter(p => (
          p.category === currentProduct.category && 
          p.id !== currentProduct.id
        ))
        .slice(0, limit);
      
      resolve(related);
    }, 300);
  });
};

/**
 * Obtiene todas las categorías únicas de los productos
 * @returns {Promise} Promesa que resuelve a un array de categorías únicas
 */
export const getAllCategories = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const categories = [...new Set(productsData.map(product => product.category))];
      resolve(categories);
    }, 200);
  });
};

/**
 * Obtiene todos los tags únicos de los productos
 * @returns {Promise} Promesa que resuelve a un array de tags únicos
 */
export const getAllTags = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Extraer todos los tags de todos los productos y crear un Set para obtener valores únicos
      const tagsSet = new Set();
      productsData.forEach(product => {
        if (Array.isArray(product.tags)) {
          product.tags.forEach(tag => tagsSet.add(tag));
        }
      });
      
      // Convertir el Set a un array
      const tags = Array.from(tagsSet);
      resolve(tags);
    }, 200);
  });
};

/**
 * Simula un proceso de pago
 * @param {Object} orderData - Datos del pedido
 * @returns {Promise} Promesa que resuelve a un objeto con el resultado del pago
 */
export const processPayment = (orderData) => {
  return new Promise((resolve, reject) => {
    // Simulamos procesamiento y aleatoriamente decidimos si el pago es exitoso o no
    setTimeout(() => {
      // 90% de probabilidad de éxito
      const isSuccessful = Math.random() <= 0.9;
      
      if (isSuccessful) {
        resolve({
          success: true,
          orderId: `ORD-${Date.now()}`,
          message: 'Pago procesado con éxito'
        });
      } else {
        reject({
          success: false,
          error: 'Error al procesar el pago',
          message: 'No se pudo completar el pago. Por favor, intente nuevamente.'
        });
      }
    }, 1500);
  });
};

/**
 * Simula envío de un formulario de contacto
 * @param {Object} contactData - Datos del formulario de contacto
 * @returns {Promise} Promesa que resuelve a un objeto con el resultado del envío
 */
export const sendContactForm = (contactData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Formulario enviado con éxito. Nos pondremos en contacto contigo pronto.'
      });
    }, 1000);
  });
};