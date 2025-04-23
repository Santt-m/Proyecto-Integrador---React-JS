import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../../../context/CartContext';
import { useToast } from '../../../../components/Toast/Toast';
import styles from './ProductCard.module.css';

function ProductCard({ product }) {
  const { addItem } = useCart();
  const { showToast } = useToast(); // Usar el hook de toast

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevenir navegación al hacer click en el botón
    addItem(product, 1);
    showToast(`${product.name} agregado al carrito`, 'success'); // Mostrar notificación
  };

  return (
    <div className={styles.productCard}>
      <Link to={`/products/${product.id}`} className={styles.productLink}>
        <div className={styles.imageContainer}>
          <img loading="lazy" src={product.image} alt={product.name} className={styles.productImage} />
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