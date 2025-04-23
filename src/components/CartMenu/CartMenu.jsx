import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import styles from './CartMenu.module.css';

function CartMenu({ isOpen, onClose }) {
  const { cartItems, removeItem, updateQuantity, getTotalPrice } = useCart();
  const { theme } = useTheme();
  const menuRef = useRef(null);

  // Cerrar el menú al hacer clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && isOpen) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Evitar scroll cuando el menú está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={`${styles.cartMenuOverlay} ${theme}`}>
      <div className={styles.cartMenu} ref={menuRef}>
        <div className={styles.cartHeader}>
          <h2>Mi Carrito</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className={styles.emptyCart}>
            <p>Tu carrito está vacío</p>
            <Link to="/products" className={styles.continueShoppingButton} onClick={onClose}>
              Explorar Productos
            </Link>
          </div>
        ) : (
          <>
            <div className={styles.cartItemList}>
              {cartItems.map((item) => (
                <div key={item.id} className={styles.cartItem}>
                  <div className={styles.itemImage}>
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className={styles.itemDetails}>
                    <h3 className={styles.itemName}>{item.name}</h3>
                    <p className={styles.itemPrice}>${item.price.toFixed(2)}</p>
                    <div className={styles.itemControls}>
                      <div className={styles.quantityControls}>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className={styles.quantityBtn}
                          aria-label="Disminuir cantidad"
                        >
                          -
                        </button>
                        <span className={styles.quantity}>{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className={styles.quantityBtn}
                          aria-label="Aumentar cantidad"
                        >
                          +
                        </button>
                      </div>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className={styles.removeBtn}
                        aria-label="Eliminar producto"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                  <div className={styles.itemTotal}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.cartFooter}>
              <div className={styles.totalPrice}>
                <span>Total:</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
              <Link 
                to="/checkout" 
                className={styles.checkoutButton}
                onClick={onClose}
              >
                Finalizar Compra
              </Link>
              <button 
                className={styles.continueShopping}
                onClick={onClose}
              >
                Seguir Comprando
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CartMenu;