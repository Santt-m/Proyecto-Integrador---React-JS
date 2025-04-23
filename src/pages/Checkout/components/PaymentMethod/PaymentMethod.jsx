import React, { useState } from 'react';
import styles from './PaymentMethod.module.css';

// Componente para manejar la selección del método de pago y los detalles
function PaymentMethod({ onComplete, onBack }) {
  const [paymentMethod, setPaymentMethod] = useState('creditCard');
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });
  const [errors, setErrors] = useState({});

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    // Limpiar errores al cambiar el método
    setErrors({});
  };

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    setCardData({
      ...cardData,
      [name]: value
    });
    
    // Limpiar el error específico cuando el usuario comienza a escribir
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validateCardData = () => {
    const newErrors = {};
    
    if (paymentMethod === 'creditCard') {
      // Validaciones básicas para tarjeta de crédito
      if (!cardData.cardNumber.trim()) {
        newErrors.cardNumber = 'El número de tarjeta es obligatorio';
      } else if (!/^\d{16}$/.test(cardData.cardNumber.replace(/\s/g, ''))) {
        newErrors.cardNumber = 'Número de tarjeta inválido';
      }
      
      if (!cardData.cardHolder.trim()) {
        newErrors.cardHolder = 'El nombre del titular es obligatorio';
      }
      
      if (!cardData.expiryDate.trim()) {
        newErrors.expiryDate = 'La fecha de expiración es obligatoria';
      } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardData.expiryDate)) {
        newErrors.expiryDate = 'Formato inválido (MM/AA)';
      }
      
      if (!cardData.cvv.trim()) {
        newErrors.cvv = 'El código de seguridad es obligatorio';
      } else if (!/^\d{3,4}$/.test(cardData.cvv)) {
        newErrors.cvv = 'CVV inválido';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (paymentMethod === 'creditCard' && !validateCardData()) {
      return;
    }
    
    // Si todo está correcto, enviar los datos al componente padre
    onComplete({
      paymentMethod,
      ...(paymentMethod === 'creditCard' ? { cardData } : {})
    });
  };

  return (
    <div className={styles.paymentMethod}>
      <h2>Método de Pago</h2>
      
      <div className={styles.paymentOptions}>
        <div
          className={`${styles.paymentOption} ${paymentMethod === 'creditCard' ? styles.selected : ''}`}
          onClick={() => handlePaymentMethodChange('creditCard')}
        >
          <div className={styles.paymentIcon}>💳</div>
          <div className={styles.paymentLabel}>Tarjeta de Crédito/Débito</div>
        </div>
        
        <div
          className={`${styles.paymentOption} ${paymentMethod === 'paypal' ? styles.selected : ''}`}
          onClick={() => handlePaymentMethodChange('paypal')}
        >
          <div className={styles.paymentIcon}>
            <span className={styles.paypalIcon}>P</span>
          </div>
          <div className={styles.paymentLabel}>PayPal</div>
        </div>
        
        <div
          className={`${styles.paymentOption} ${paymentMethod === 'mercadoPago' ? styles.selected : ''}`}
          onClick={() => handlePaymentMethodChange('mercadoPago')}
        >
          <div className={styles.paymentIcon}>
            <span className={styles.mercadoPagoIcon}>MP</span>
          </div>
          <div className={styles.paymentLabel}>Mercado Pago</div>
        </div>
      </div>
      
      {paymentMethod === 'creditCard' && (
        <form onSubmit={handleSubmit} className={styles.cardForm}>
          <div className={styles.formGroup}>
            <label htmlFor="cardNumber">Número de Tarjeta</label>
            <input
              type="text"
              id="cardNumber"
              name="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={cardData.cardNumber}
              onChange={handleCardInputChange}
              className={errors.cardNumber ? styles.inputError : ''}
              maxLength="19"
            />
            {errors.cardNumber && <span className={styles.error}>{errors.cardNumber}</span>}
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="cardHolder">Titular de la Tarjeta</label>
            <input
              type="text"
              id="cardHolder"
              name="cardHolder"
              placeholder="Nombre como aparece en la tarjeta"
              value={cardData.cardHolder}
              onChange={handleCardInputChange}
              className={errors.cardHolder ? styles.inputError : ''}
            />
            {errors.cardHolder && <span className={styles.error}>{errors.cardHolder}</span>}
          </div>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="expiryDate">Fecha de Expiración</label>
              <input
                type="text"
                id="expiryDate"
                name="expiryDate"
                placeholder="MM/AA"
                value={cardData.expiryDate}
                onChange={handleCardInputChange}
                className={errors.expiryDate ? styles.inputError : ''}
                maxLength="5"
              />
              {errors.expiryDate && <span className={styles.error}>{errors.expiryDate}</span>}
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="cvv">CVV</label>
              <input
                type="text"
                id="cvv"
                name="cvv"
                placeholder="123"
                value={cardData.cvv}
                onChange={handleCardInputChange}
                className={errors.cvv ? styles.inputError : ''}
                maxLength="4"
              />
              {errors.cvv && <span className={styles.error}>{errors.cvv}</span>}
            </div>
          </div>
        </form>
      )}
      
      {paymentMethod === 'paypal' && (
        <div className={styles.alternativePayment}>
          <p>Serás redirigido a PayPal para completar tu pago de forma segura.</p>
        </div>
      )}
      
      {paymentMethod === 'mercadoPago' && (
        <div className={styles.alternativePayment}>
          <p>Serás redirigido a Mercado Pago para completar tu pago de forma segura.</p>
        </div>
      )}
      
      <div className={styles.formActions}>
        <button type="button" className={styles.backButton} onClick={onBack}>
          Volver
        </button>
        <button type="submit" className={styles.payButton} onClick={handleSubmit}>
          {paymentMethod === 'creditCard' ? 'Pagar Ahora' : 'Continuar'}
        </button>
      </div>
    </div>
  );
}

export default PaymentMethod;