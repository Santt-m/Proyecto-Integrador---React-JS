import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../../../context/CartContext';
import styles from './OrderConfirmation.module.css';
import config from './config.json';

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
      <h2>{config.thanksMessage}</h2>
      <p className={styles.confirmationMessage}>
        {config.confirmationMessage}
      </p>
      
      <div className={styles.orderDetails}>
        <div className={styles.orderInfo}>
          <h3>{config.orderDetails.title}</h3>
          <p><strong>{config.orderDetails.orderNumber}:</strong> #{orderDetails.orderNumber}</p>
          <p><strong>{config.orderDetails.date}:</strong> {formatDate(new Date())}</p>
          <p><strong>{config.orderDetails.paymentMethod.label}:</strong> {
            orderDetails.paymentMethod === 'creditCard' 
              ? config.orderDetails.paymentMethod.creditCard
              : orderDetails.paymentMethod === 'paypal' 
                ? config.orderDetails.paymentMethod.paypal
                : config.orderDetails.paymentMethod.mercadoPago
          }</p>
          <p><strong>{config.orderDetails.status.label}:</strong> <span className={styles.orderStatus}>{config.orderDetails.status.confirmed}</span></p>
          <p><strong>{config.orderDetails.estimatedDelivery}:</strong> {formatDate(estimatedDeliveryDate)}</p>
        </div>
        
        <div className={styles.shippingInfo}>
          <h3>{config.shippingInfo.title}</h3>
          <p><strong>{config.shippingInfo.recipient}:</strong> {orderDetails.shipping.firstName} {orderDetails.shipping.lastName}</p>
          <p><strong>{config.shippingInfo.address}:</strong> {orderDetails.shipping.address}</p>
          <p><strong>{config.shippingInfo.city}:</strong> {orderDetails.shipping.city}, {orderDetails.shipping.state}</p>
          <p><strong>{config.shippingInfo.zipCode}:</strong> {orderDetails.shipping.zipCode}</p>
          <p><strong>{config.shippingInfo.phone}:</strong> {orderDetails.shipping.phone}</p>
        </div>
      </div>
      
      <div className={styles.orderSummary}>
        <h3>{config.orderSummary.title}</h3>
        <div className={styles.itemsList}>
          {orderDetails.items.map((item) => (
            <div key={item.id} className={styles.orderItem}>
              <div className={styles.itemImage}>
                <img src={item.image} alt={item.name} />
              </div>
              <div className={styles.itemDetails}>
                <p className={styles.itemName}>{item.name}</p>
                <p className={styles.itemQuantity}>{config.orderSummary.quantity}: {item.quantity}</p>
              </div>
              <p className={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>
        
        <div className={styles.orderTotals}>
          <div className={styles.totalRow}>
            <span>{config.orderSummary.subtotal}:</span>
            <span>${orderDetails.subtotal.toFixed(2)}</span>
          </div>
          <div className={styles.totalRow}>
            <span>{config.orderSummary.shipping}:</span>
            <span>${orderDetails.shipping.cost.toFixed(2)}</span>
          </div>
          <div className={styles.totalRow}>
            <span>{config.orderSummary.tax}:</span>
            <span>${orderDetails.tax.toFixed(2)}</span>
          </div>
          <div className={`${styles.totalRow} ${styles.grandTotal}`}>
            <span>{config.orderSummary.total}:</span>
            <span>${orderDetails.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      <div className={styles.confirmationActions}>
        <button 
          className={styles.continueButton}
          onClick={handleContinueShopping}
        >
          {config.actions.continueShopping}
        </button>
        
        <Link to="/" className={styles.homeLink}>
          {config.actions.backToHome}
        </Link>
      </div>
    </div>
  );
}

export default OrderConfirmation;