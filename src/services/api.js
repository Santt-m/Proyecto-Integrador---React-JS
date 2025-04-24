// src/services/api.js
import productsData from '../data/products.json';

/**
 * Sistema de caché para mejorar el rendimiento
 */
const cache = {
  data: new Map(), // Caché para datos
  images: new Map(), // Caché para imágenes
  expiry: 5 * 60 * 1000, // Tiempo de expiración: 5 minutos en milisegundos
};

/**
 * Obtiene un elemento de la caché
 * @param {string} key - Clave para identificar el elemento
 * @param {string} type - Tipo de caché ('data' o 'images')
 * @returns {any|null} El elemento cacheado o null si no existe o ha expirado
 */
const getFromCache = (key, type = 'data') => {
  const cacheStore = cache[type];
  const cached = cacheStore.get(key);
  
  if (!cached) return null;
  
  // Verificar si la caché ha expirado
  if (Date.now() - cached.timestamp > cache.expiry) {
    cacheStore.delete(key);
    console.log(`🗑️ Caché expirada para: ${key}`);
    return null;
  }
  
  console.log(`🔍 Obtenido de caché (${type}): ${key}`);
  return cached.data;
};

/**
 * Almacena un elemento en la caché
 * @param {string} key - Clave para identificar el elemento
 * @param {any} data - Datos a almacenar
 * @param {string} type - Tipo de caché ('data' o 'images')
 */
const saveToCache = (key, data, type = 'data') => {
  cache[type].set(key, {
    data,
    timestamp: Date.now()
  });
  console.log(`💾 Guardado en caché (${type}): ${key}`);
};

/**
 * Precarga imágenes para mejorar la experiencia del usuario
 * @param {Array} products - Array de productos con imágenes a precargar
 */
const preloadImages = (products) => {
  if (!products || products.length === 0) return;
  
  // Usar setTimeout para no bloquear el hilo principal
  setTimeout(() => {
    // Precargar solo las primeras 6 imágenes inicialmente para mejorar el rendimiento
    const initialImagesToPreload = products.slice(0, 6);
    
    initialImagesToPreload.forEach(product => {
      // Precargar imagen principal
      if (product.image && !cache.images.has(product.image)) {
        const img = new Image();
        img.src = product.image;
        img.onload = () => {
          saveToCache(product.image, img.src, 'images');
        };
      }
      
      // Precargar solo la primera imagen adicional por producto para reducir la carga inicial
      if (product.images && Array.isArray(product.images) && product.images.length > 0) {
        const firstImage = product.images[0];
        if (!cache.images.has(firstImage)) {
          const img = new Image();
          img.src = firstImage;
          img.onload = () => {
            saveToCache(firstImage, img.src, 'images');
          };
        }
      }
    });
    
    // Precargar el resto de imágenes después de un retraso para priorizar el contenido visible
    setTimeout(() => {
      products.forEach(product => {
        // Omitir las primeras 6 productos ya procesados
        if (initialImagesToPreload.includes(product)) return;
        
        if (product.image && !cache.images.has(product.image)) {
          const img = new Image();
          img.src = product.image;
          img.onload = () => {
            saveToCache(product.image, img.src, 'images');
          };
        }
        
        // Precargar imágenes adicionales de todos los productos
        if (product.images && Array.isArray(product.images)) {
          product.images.forEach((imgSrc, index) => {
            // Para los primeros 6 productos, saltamos la primera imagen que ya hemos precargado
            if (initialImagesToPreload.includes(product) && index === 0) return;
            
            if (!cache.images.has(imgSrc)) {
              const img = new Image();
              img.src = imgSrc;
              img.onload = () => {
                saveToCache(imgSrc, img.src, 'images');
              };
            }
          });
        }
      });
      console.log(`🖼️ Precargando todas las imágenes restantes en segundo plano`);
    }, 2000); // Retraso de 2 segundos para el resto de imágenes
    
    console.log(`🖼️ Precargando ${initialImagesToPreload.length} imágenes prioritarias en segundo plano`);
  }, 300);
};

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
  console.log('📡 GET: Solicitando todos los productos');
  
  // Verificar si está en caché
  const cachedData = getFromCache('allProducts');
  if (cachedData) {
    console.log(`✅ GET: Retornando ${cachedData.length} productos desde caché`);
    return Promise.resolve(cachedData);
  }
  
  return new Promise((resolve) => {
    // Simulamos un delay como si fuera una API real
    setTimeout(() => {
      console.log(`✅ GET: Obtenidos ${productsData.length} productos`);
      
      // Guardar en caché
      saveToCache('allProducts', productsData);
      
      // Precargar imágenes
      preloadImages(productsData);
      
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
  console.log(`📡 GET: Solicitando producto con ID ${id}`);
  
  // Verificar si está en caché
  const cacheKey = `product_${id}`;
  const cachedData = getFromCache(cacheKey);
  if (cachedData) {
    console.log(`✅ GET: Retornando producto ${id} desde caché`);
    return Promise.resolve(cachedData);
  }
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const product = productsData.find(p => p.id === parseInt(id, 10)) || null;
      
      if (product) {
        console.log(`✅ GET: Producto ${id} encontrado: ${product.name}`);
        
        // Guardar en caché
        saveToCache(cacheKey, product);
        
        // Precargar imágenes de este producto
        preloadImages([product]);
      } else {
        console.log(`❌ GET: Producto con ID ${id} no encontrado`);
      }
      
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
  console.log(`📡 GET: Solicitando productos destacados (límite: ${limit})`);
  
  // Verificar si está en caché
  const cacheKey = `featured_${limit}`;
  const cachedData = getFromCache(cacheKey);
  if (cachedData) {
    console.log(`✅ GET: Retornando ${cachedData.length} productos destacados desde caché`);
    return Promise.resolve(cachedData);
  }
  
  return new Promise((resolve) => {
    setTimeout(() => {
      // Filtramos productos que tengan la propiedad featured como true
      const featured = productsData.filter(p => p.featured).slice(0, limit);
      console.log(`✅ GET: Obtenidos ${featured.length} productos destacados`);
      
      // Guardar en caché
      saveToCache(cacheKey, featured);
      
      // Precargar imágenes
      preloadImages(featured);
      
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
  console.log(`📡 GET: Solicitando productos relacionados al ID ${productId} (límite: ${limit})`);
  
  // Verificar si está en caché
  const cacheKey = `related_${productId}_${limit}`;
  const cachedData = getFromCache(cacheKey);
  if (cachedData) {
    console.log(`✅ GET: Retornando ${cachedData.length} productos relacionados desde caché`);
    return Promise.resolve(cachedData);
  }
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const currentProduct = productsData.find(p => p.id === parseInt(productId, 10));
      
      if (!currentProduct) {
        console.log(`❌ GET: Producto referencia con ID ${productId} no encontrado`);
        resolve([]);
        return;
      }
      
      const related = productsData
        .filter(p => (
          p.category === currentProduct.category && 
          p.id !== currentProduct.id
        ))
        .slice(0, limit);
      
      console.log(`✅ GET: Obtenidos ${related.length} productos relacionados a ${currentProduct.name}`);
      
      // Guardar en caché
      saveToCache(cacheKey, related);
      
      // Precargar imágenes
      preloadImages(related);
      
      resolve(related);
    }, 300);
  });
};

/**
 * Obtiene todas las categorías únicas de los productos
 * @returns {Promise} Promesa que resuelve a un array de categorías únicas
 */
export const getAllCategories = () => {
  console.log('📡 GET: Solicitando todas las categorías');
  
  // Verificar si está en caché
  const cachedData = getFromCache('allCategories');
  if (cachedData) {
    console.log(`✅ GET: Retornando ${cachedData.length} categorías desde caché`);
    return Promise.resolve(cachedData);
  }
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const categories = [...new Set(productsData.map(product => product.category))];
      console.log(`✅ GET: Obtenidas ${categories.length} categorías únicas`);
      
      // Guardar en caché
      saveToCache('allCategories', categories);
      
      resolve(categories);
    }, 200);
  });
};

/**
 * Obtiene todos los tags únicos de los productos
 * @returns {Promise} Promesa que resuelve a un array de tags únicos
 */
export const getAllTags = () => {
  console.log('📡 GET: Solicitando todos los tags');
  
  // Verificar si está en caché
  const cachedData = getFromCache('allTags');
  if (cachedData) {
    console.log(`✅ GET: Retornando ${cachedData.length} tags desde caché`);
    return Promise.resolve(cachedData);
  }
  
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
      console.log(`✅ GET: Obtenidos ${tags.length} tags únicos`);
      
      // Guardar en caché
      saveToCache('allTags', tags);
      
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
  console.log('📡 POST: Procesando pago', orderData);
  
  return new Promise((resolve, reject) => {
    // Simulamos procesamiento y aleatoriamente decidimos si el pago es exitoso o no
    setTimeout(() => {
      // 90% de probabilidad de éxito
      const isSuccessful = Math.random() <= 0.9;
      
      if (isSuccessful) {
        const result = {
          success: true,
          orderId: `ORD-${Date.now()}`,
          message: 'Pago procesado con éxito'
        };
        console.log('✅ POST: Pago procesado exitosamente', result);
        resolve(result);
      } else {
        const error = {
          success: false,
          error: 'Error al procesar el pago',
          message: 'No se pudo completar el pago. Por favor, intente nuevamente.'
        };
        console.log('❌ POST: Error al procesar pago', error);
        reject(error);
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
  console.log('📡 POST: Enviando formulario de contacto', contactData);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const result = {
        success: true,
        message: 'Formulario enviado con éxito. Nos pondremos en contacto contigo pronto.'
      };
      console.log('✅ POST: Formulario enviado exitosamente', result);
      resolve(result);
    }, 1000);
  });
};

/**
 * Limpia toda la caché o un tipo específico
 * @param {string} type - Tipo de caché a limpiar ('data', 'images' o 'all')
 */
export const clearCache = (type = 'all') => {
  console.log(`🗑️ Limpiando caché: ${type}`);
  
  if (type === 'all' || type === 'data') {
    cache.data.clear();
    console.log('🗑️ Caché de datos limpiada');
  }
  
  if (type === 'all' || type === 'images') {
    cache.images.clear();
    console.log('🗑️ Caché de imágenes limpiada');
  }
};