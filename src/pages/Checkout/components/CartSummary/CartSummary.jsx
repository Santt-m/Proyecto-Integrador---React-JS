import React from 'react';
import { useCart } from '../../../../context/CartContext';
import styles from './CartSummary.module.css';

function CartSummary() {
  const { cartItems, removeItem, updateQuantity, getTotalPrice } = useCart();

  return (
    <div className={styles.cartSummary}>
      <h2>Resumen de la Orden</h2>
      
      {cartItems.length === 0 ? (
        <p className={styles.emptyCart}>Tu carrito está vacío</p>
      ) : (
        <>
          <div className={styles.productList}>
            {cartItems.map((item) => (
              <div key={item.id} className={styles.productItem}>
                <div className={styles.productImage}>
                  <img src={item.image} alt={item.name} />
                </div>
                <div className={styles.productInfo}>
                  <h3>{item.name}</h3>
                  <p className={styles.productPrice}>${item.price.toFixed(2)}</p>
                  <div className={styles.quantityControls}>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className={styles.quantityBtn}
                    >
                      -
                    </button>
                    <span className={styles.quantity}>{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className={styles.quantityBtn}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className={styles.productActions}>
                  <button 
                    onClick={() => removeItem(item.id)}
                    className={styles.removeBtn}
                    aria-label="Eliminar producto"
                  >
                    <span>×</span>
                  </button>
                  <p className={styles.subtotal}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.summaryDetails}>
            <div className={styles.summaryRow}>
              <span>Subtotal:</span>
              <span>${getTotalPrice().toFixed(2)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Envío:</span>
              <span>Calculado al finalizar</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Impuestos:</span>
              <span>Calculados al finalizar</span>
            </div>
            <div className={`${styles.summaryRow} ${styles.total}`}>
              <span>Total:</span>
              <span>${getTotalPrice().toFixed(2)}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default CartSummary;