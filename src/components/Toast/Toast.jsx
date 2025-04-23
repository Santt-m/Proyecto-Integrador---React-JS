import React, { useState, useEffect, createContext, useContext } from 'react';
import styles from './Toast.module.css';

// Crear el contexto
const ToastContext = createContext();

// Hook personalizado para usar el Toast
export const useToast = () => useContext(ToastContext);

// Componente de notificación Toast individual
const ToastItem = ({ message, type, onClose }) => {
  useEffect(() => {
    // Auto-cerrar después de 3 segundos
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      <div className={styles.toastMessage}>{message}</div>
      <button className={styles.closeButton} onClick={onClose}>×</button>
    </div>
  );
};

// Proveedor del contexto Toast
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // Función para mostrar un nuevo toast
  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prevToasts => [...prevToasts, { id, message, type }]);
  };

  // Función para cerrar un toast específico
  const closeToast = (id) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  };

  // Valores expuestos por el contexto
  const contextValue = {
    showToast
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <div className={styles.toastContainer}>
        {toasts.map(toast => (
          <ToastItem 
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => closeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider;