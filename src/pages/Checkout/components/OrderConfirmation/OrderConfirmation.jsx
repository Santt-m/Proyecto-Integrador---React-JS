import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../../../context/CartContext';
import styles from './OrderConfirmation.module.css';

function OrderConfirmation({ orderDetails }) {
  const navigate = useNavigate();
  const { clearCart } = useCart();

  // Limpiar el carrito automáticamente cuando se confirma la orden
  useEffect(() => {
    clearCart();
  }, []);
  
  const handleContinueShopping = () => {
    // Usamos navigate con { replace: true } para asegurarnos de reemplazar
    // la entrada actual en el historial y evitar problemas de navegación
    navigate('/products', { replace: true });
  };
  
  const formatDate = (date) => {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const estimatedDeliveryDate = new Date();
  estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 5);

  return (
    <div className={styles.orderConfirmation}>
      <div className={styles.successIcon}>✓</div>
      <h2>¡Gracias por tu compra!</h2>
      <p className={styles.confirmationMessage}>
        Tu pedido ha sido procesado correctamente.
      </p>
      
      <div className={styles.orderDetails}>
        <div className={styles.orderInfo}>
          <h3>Detalles del Pedido</h3>
          <p><strong>Número de Pedido:</strong> #{orderDetails.orderNumber}</p>
          <p><strong>Fecha:</strong> {formatDate(new Date())}</p>
          <p><strong>Método de Pago:</strong> {orderDetails.paymentMethod === 'creditCard' 
            ? 'Tarjeta de Crédito/Débito' 
            : orderDetails.paymentMethod === 'paypal' 
              ? 'PayPal' 
              : 'Mercado Pago'}</p>
          <p><strong>Estado:</strong> <span className={styles.orderStatus}>Confirmado</span></p>
          <p><strong>Entrega Estimada:</strong> {formatDate(estimatedDeliveryDate)}</p>
        </div>
        
        <div className={styles.shippingInfo}>
          <h3>Información de Envío</h3>
          <p><strong>Destinatario:</strong> {orderDetails.shipping.firstName} {orderDetails.shipping.lastName}</p>
          <p><strong>Dirección:</strong> {orderDetails.shipping.address}</p>
          <p><strong>Ciudad:</strong> {orderDetails.shipping.city}, {orderDetails.shipping.state}</p>
          <p><strong>Código Postal:</strong> {orderDetails.shipping.zipCode}</p>
          <p><strong>Teléfono:</strong> {orderDetails.shipping.phone}</p>
        </div>
      </div>
      
      <div className={styles.orderSummary}>
        <h3>Resumen de la Compra</h3>
        <div className={styles.itemsList}>
          {orderDetails.items.map((item) => (
            <div key={item.id} className={styles.orderItem}>
              <div className={styles.itemImage}>
                <img src={item.image} alt={item.name} />
              </div>
              <div className={styles.itemDetails}>
                <p className={styles.itemName}>{item.name}</p>
                <p className={styles.itemQuantity}>Cantidad: {item.quantity}</p>
              </div>
              <p className={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>
        
        <div className={styles.orderTotals}>
          <div className={styles.totalRow}>
            <span>Subtotal:</span>
            <span>${orderDetails.subtotal.toFixed(2)}</span>
          </div>
          <div className={styles.totalRow}>
            <span>Envío:</span>
            <span>${orderDetails.shipping.cost.toFixed(2)}</span>
          </div>
          <div className={styles.totalRow}>
            <span>Impuestos:</span>
            <span>${orderDetails.tax.toFixed(2)}</span>
          </div>
          <div className={`${styles.totalRow} ${styles.grandTotal}`}>
            <span>Total:</span>
            <span>${orderDetails.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      <div className={styles.confirmationActions}>
        <button 
          className={styles.continueButton}
          onClick={handleContinueShopping}
        >
          Seguir Comprando
        </button>
        
        {/* Añadir un enlace alternativo para asegurar que hay más de una forma de navegar */}
        <Link to="/" className={styles.homeLink}>
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}

export default OrderConfirmation;