import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../../../context/CartContext';
import { useToast } from '../../../../components/Toast/Toast';
import ImageSkeleton from '../../../../components/ImageSkeleton/ImageSkeleton';
import styles from './ProductCard.module.css';

function ProductCard({ product }) {
  const { addItem } = useCart();
  const { showToast } = useToast();
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevenir navegación al hacer click en el botón
    addItem(product, 1);
    showToast(`${product.name} agregado al carrito`, 'success'); // Mostrar notificación
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div className={styles.productCard}>
      <Link to={`/products/${product.id}`} className={styles.productLink}>
        <div className={styles.imageContainer}>
          {!imageLoaded && <ImageSkeleton height="200px" borderRadius="8px" />}
          <img 
            loading="lazy" 
            src={product.image} 
            alt={product.name} 
            className={`${styles.productImage} ${imageLoaded ? styles.loaded : styles.loading}`} 
            onLoad={handleImageLoad}
          />
        </div>
        <div className={styles.productInfo}>
          <h3 className={styles.productName}>{product.name}</h3>
          <p className={styles.productPrice}>${product.price.toFixed(2)}</p>
          <button 
            onClick={handleAddToCart} 
            className={styles.addToCartButton}
          >
            Agregar al Carrito
          </button>
        </div>
      </Link>
    </div>
  );
}

export default ProductCard;