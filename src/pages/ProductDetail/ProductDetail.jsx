// src/pages/ProductDetail/ProductDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../components/Toast/Toast';
import ProductDetailSkeleton from './ProductDetailSkeleton';
import { getProductById, getRelatedProducts } from '../../services/api';
import styles from './ProductDetail.module.css';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { showToast } = useToast();
  
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    // Reiniciar el estado cuando cambia el ID
    setLoading(true);
    setQuantity(1);
    setActiveImage(0);
    
    const fetchProductData = async () => {
      try {
        // Obtener producto por ID
        const productData = await getProductById(id);
        
        if (productData) {
          setProduct(productData);
          
          // Obtener productos relacionados
          const relatedData = await getRelatedProducts(id, 3);
          setRelatedProducts(relatedData);
        }
      } catch (error) {
        console.error('Error al cargar el producto:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProductData();
  }, [id]);

  // Mostrar skeleton durante la carga
  if (loading) {
    return <ProductDetailSkeleton />;
  }

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value >= 1 && value <= product.stock) {
      setQuantity(value);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
      showToast(`${quantity} ${quantity > 1 ? 'unidades' : 'unidad'} de ${product.name} agregadas al carrito`, 'success');
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleImageChange = (index) => {
    setActiveImage(index);
  };

  const calculateDiscountedPrice = (product) => {
    if (!product.discount) return product.price;
    return product.price * (1 - product.discount / 100);
  };

  if (!product) {
    return (
      <div className={styles.errorContainer}>
        <h2>Producto no encontrado</h2>
        <p>Lo sentimos, el producto que estás buscando no existe.</p>
        <button onClick={handleGoBack} className={styles.backButton}>
          Volver
        </button>
      </div>
    );
  }

  // Determinar qué imágenes mostrar
  const images = product.images && product.images.length > 0 
    ? [product.image, ...product.images] 
    : [product.image];

  const mainImage = images[activeImage];
  const discountedPrice = calculateDiscountedPrice(product);

  return (
    <div className={styles.productDetailPage}>
      <button onClick={handleGoBack} className={styles.backButton}>
        &larr; Volver
      </button>
      
      <div className={styles.productContainer}>
        <div className={styles.productImageSection}>
          <div className={styles.productImageContainer}>
            <img src={mainImage} alt={product.name} className={styles.productImage} />
            {product.discount && (
              <div className={styles.discountBadge}>-{product.discount}%</div>
            )}
          </div>
          
          {images.length > 1 && (
            <div className={styles.thumbnailsContainer}>
              {images.map((img, index) => (
                <div 
                  key={index}
                  className={`${styles.thumbnail} ${activeImage === index ? styles.activeThumbnail : ''}`}
                  onClick={() => handleImageChange(index)}
                >
                  <img src={img} alt={`${product.name} - vista ${index + 1}`} />
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className={styles.productInfo}>
          <h1 className={styles.productName}>{product.name}</h1>
          
          <div className={styles.productMeta}>
            <span className={styles.productCategory}>Categoría: {product.category}</span>
            <span className={styles.productStock}>
              {product.stock > 0 
                ? `${product.stock} unidades disponibles` 
                : 'Agotado'}
            </span>
          </div>
          
          <div className={styles.productPrice}>
            {product.discount ? (
              <>
                <span className={styles.originalPrice}>${product.price.toFixed(2)}</span>
                <span className={styles.discountedPrice}>${discountedPrice.toFixed(2)}</span>
              </>
            ) : (
              <>${product.price.toFixed(2)}</>
            )}
          </div>

          {product.rating && (
            <div className={styles.ratingContainer}>
              <div className={styles.stars} style={{ '--rating': product.rating }}></div>
              <span className={styles.ratingText}>({product.rating.toFixed(1)})</span>
            </div>
          )}
          
          {product.tags && product.tags.length > 0 && (
            <div className={styles.tagsContainer}>
              {product.tags.map(tag => (
                <span key={tag} className={styles.tag}>{tag}</span>
              ))}
            </div>
          )}
          
          <div className={styles.productDescription}>
            <h3>Descripción</h3>
            <p>{product.longDescription || product.description}</p>
          </div>

          {product.specifications && (
            <div className={styles.specificationsContainer}>
              <h3>Especificaciones</h3>
              <ul className={styles.specificationsList}>
                {Object.entries(product.specifications).map(([key, value]) => (
                  <li key={key} className={styles.specificationItem}>
                    <span className={styles.specName}>{key}:</span>
                    <span className={styles.specValue}>{value}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className={styles.addToCartSection}>
            <div className={styles.quantityControl}>
              <button 
                onClick={decrementQuantity} 
                disabled={quantity <= 1}
                className={styles.quantityButton}
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                min="1"
                max={product.stock}
                className={styles.quantityInput}
              />
              <button 
                onClick={incrementQuantity} 
                disabled={quantity >= product.stock}
                className={styles.quantityButton}
              >
                +
              </button>
            </div>
            
            <button 
              onClick={handleAddToCart} 
              disabled={product.stock <= 0}
              className={`${styles.addToCartButton} ${product.stock <= 0 ? styles.disabledButton : ''}`}
            >
              {product.stock > 0 ? 'Agregar al Carrito' : 'Agotado'}
            </button>
          </div>
        </div>
      </div>
      
      {relatedProducts.length > 0 && (
        <div className={styles.relatedProductsSection}>
          <h2>Productos Relacionados</h2>
          <div className={styles.relatedProductsGrid}>
            {relatedProducts.map(relatedProduct => (
              <a 
                key={relatedProduct.id} 
                href={`/products/${relatedProduct.id}`}
                className={styles.relatedProductCard}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/products/${relatedProduct.id}`);
                }}
              >
                <div className={styles.relatedProductImage}>
                  <img src={relatedProduct.image} alt={relatedProduct.name} />
                  {relatedProduct.discount && (
                    <div className={styles.relatedDiscountBadge}>-{relatedProduct.discount}%</div>
                  )}
                </div>
                <div className={styles.relatedProductInfo}>
                  <h3>{relatedProduct.name}</h3>
                  {relatedProduct.discount ? (
                    <div className={styles.relatedProductPrice}>
                      <span className={styles.relatedOriginalPrice}>${relatedProduct.price.toFixed(2)}</span>
                      <span>${calculateDiscountedPrice(relatedProduct).toFixed(2)}</span>
                    </div>
                  ) : (
                    <p>${relatedProduct.price.toFixed(2)}</p>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetail;
