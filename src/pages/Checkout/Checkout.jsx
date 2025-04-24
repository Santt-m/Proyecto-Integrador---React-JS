import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import SEOHead from '../../components/SEOHead/SEOHead';
import CartSummary from './components/CartSummary/CartSummary';
import ShippingForm from './components/ShippingForm/ShippingForm';
import PaymentMethod from './components/PaymentMethod/PaymentMethod';
import OrderConfirmation from './components/OrderConfirmation/OrderConfirmation';
import styles from './Checkout.module.css';
// Importamos la configuración
import config from './config.json';

function Checkout() {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [step, setStep] = useState('shipping');
  const [shippingData, setShippingData] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Redireccionar al inicio si el carrito está vacío y no estamos en confirmación
  useEffect(() => {
    if (cartItems.length === 0 && step !== 'confirmation') {
      // Solo redirigimos si estamos en los pasos iniciales del checkout
      // y no después de completar una compra (donde el carrito ya estará vacío)
      if (step === 'shipping' || step === 'payment') {
        navigate('/');
      }
    }
  }, [cartItems, navigate, step]);

  const handleShippingSubmit = (data) => {
    setShippingData(data);
    setStep('payment');
    window.scrollTo(0, 0);
  };

  const handlePaymentSubmit = (data) => {
    setIsLoading(true);
    setPaymentData(data);

    // Simular procesamiento del pago
    setTimeout(() => {
      // Generar un número de pedido aleatorio
      const orderNumber = Math.floor(100000 + Math.random() * 900000);
      
      // Calcular impuestos (ejemplo: 21% IVA)
      const subtotal = getTotalPrice();
      const tax = subtotal * 0.21;
      const shippingCost = 500; // Costo fijo de envío
      const total = subtotal + tax + shippingCost;
      
      setOrderDetails({
        orderNumber,
        items: cartItems,
        subtotal,
        tax,
        shipping: {
          ...shippingData,
          cost: shippingCost
        },
        paymentMethod: data.paymentMethod,
        total
      });
      
      setStep('confirmation');
      setIsLoading(false);
      window.scrollTo(0, 0);
    }, 2000);
  };

  const handleBackToShipping = () => {
    setStep('shipping');
    window.scrollTo(0, 0);
  };

  const renderStepIndicator = () => {
    return (
      <div className={styles.stepIndicator}>
        <div className={`${styles.step} ${styles.active}`}>
          <div className={styles.stepNumber}>{config.steps.shipping.number}</div>
          <div className={styles.stepLabel}>{config.steps.shipping.label}</div>
        </div>
        <div className={styles.stepConnector}></div>
        <div className={`${styles.step} ${step === 'payment' || step === 'confirmation' ? styles.active : ''}`}>
          <div className={styles.stepNumber}>{config.steps.payment.number}</div>
          <div className={styles.stepLabel}>{config.steps.payment.label}</div>
        </div>
        <div className={styles.stepConnector}></div>
        <div className={`${styles.step} ${step === 'confirmation' ? styles.active : ''}`}>
          <div className={styles.stepNumber}>{config.steps.confirmation.number}</div>
          <div className={styles.stepLabel}>{config.steps.confirmation.label}</div>
        </div>
      </div>
    );
  };

  return (
    <>
      <SEOHead
        title={config.seo.title}
        description={config.seo.description}
        keywords={config.seo.keywords}
        canonical="https://proyecto-integrador-react-js-beta.vercel.app/checkout"
      />
      <div className={`${styles.checkoutContainer} ${theme}`}>
        <h1 className={styles.pageTitle}>{config.pageTitle}</h1>

        {/* Indicador de pasos del checkout */}
        {step !== 'confirmation' && renderStepIndicator()}

        {/* Pantalla de carga durante el procesamiento del pago */}
        {isLoading && (
          <div className={styles.loadingOverlay}>
            <div className={styles.spinner}></div>
            <p>{config.loading.message}</p>
          </div>
        )}

        <div className={styles.checkoutContent}>
          {step === 'shipping' && (
            <div className={styles.shippingSection}>
              <ShippingForm onContinue={handleShippingSubmit} />
              <div className={styles.cartSummaryMini}>
                <CartSummary />
              </div>
            </div>
          )}

          {step === 'payment' && (
            <div className={styles.paymentSection}>
              <PaymentMethod 
                onComplete={handlePaymentSubmit} 
                onBack={handleBackToShipping} 
              />
              <div className={styles.cartSummaryMini}>
                <CartSummary />
              </div>
            </div>
          )}

          {step === 'confirmation' && (
            <div className={styles.confirmationSection}>
              <OrderConfirmation orderDetails={orderDetails} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Checkout;
