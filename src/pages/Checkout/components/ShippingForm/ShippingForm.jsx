import React, { useState, useEffect } from 'react';
import styles from './ShippingForm.module.css';

function ShippingForm({ onContinue }) {
  // Cargar datos del localStorage al iniciar el componente
  const loadSavedData = () => {
    try {
      const savedData = localStorage.getItem('shippingInfo');
      return savedData ? JSON.parse(savedData) : {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        saveInfo: false
      };
    } catch (error) {
      console.error("Error al cargar datos guardados:", error);
      return {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        saveInfo: false
      };
    }
  };

  const [formData, setFormData] = useState(loadSavedData);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Limpiar el error cuando el usuario comienza a escribir
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'El nombre es obligatorio';
    if (!formData.lastName.trim()) newErrors.lastName = 'El apellido es obligatorio';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!formData.phone.trim()) newErrors.phone = 'El teléfono es obligatorio';
    if (!formData.address.trim()) newErrors.address = 'La dirección es obligatoria';
    if (!formData.city.trim()) newErrors.city = 'La ciudad es obligatoria';
    if (!formData.state.trim()) newErrors.state = 'La provincia/estado es obligatorio';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'El código postal es obligatorio';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Guardar datos en localStorage si la opción está marcada
      if (formData.saveInfo) {
        try {
          localStorage.setItem('shippingInfo', JSON.stringify(formData));
        } catch (error) {
          console.error("Error al guardar datos en localStorage:", error);
        }
      } else {
        // Si desmarcó la opción, borrar los datos guardados
        try {
          localStorage.removeItem('shippingInfo');
        } catch (error) {
          console.error("Error al eliminar datos de localStorage:", error);
        }
      }
      
      onContinue(formData);
    }
  };

  return (
    <div className={styles.shippingForm}>
      <h2>Información de Envío</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="firstName">Nombre</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={errors.firstName ? styles.inputError : ''}
            />
            {errors.firstName && <span className={styles.error}>{errors.firstName}</span>}
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="lastName">Apellido</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={errors.lastName ? styles.inputError : ''}
            />
            {errors.lastName && <span className={styles.error}>{errors.lastName}</span>}
          </div>
        </div>
        
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? styles.inputError : ''}
            />
            {errors.email && <span className={styles.error}>{errors.email}</span>}
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="phone">Teléfono</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={errors.phone ? styles.inputError : ''}
            />
            {errors.phone && <span className={styles.error}>{errors.phone}</span>}
          </div>
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="address">Dirección</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className={errors.address ? styles.inputError : ''}
          />
          {errors.address && <span className={styles.error}>{errors.address}</span>}
        </div>
        
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="city">Ciudad</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={errors.city ? styles.inputError : ''}
            />
            {errors.city && <span className={styles.error}>{errors.city}</span>}
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="state">Provincia/Estado</label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className={errors.state ? styles.inputError : ''}
            />
            {errors.state && <span className={styles.error}>{errors.state}</span>}
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="zipCode">Código Postal</label>
            <input
              type="text"
              id="zipCode"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              className={errors.zipCode ? styles.inputError : ''}
            />
            {errors.zipCode && <span className={styles.error}>{errors.zipCode}</span>}
          </div>
        </div>
        
        <div className={styles.formGroup}>
          <div className={styles.checkboxContainer}>
            <input
              type="checkbox"
              id="saveInfo"
              name="saveInfo"
              checked={formData.saveInfo}
              onChange={handleChange}
            />
            <label htmlFor="saveInfo">
              Guardar esta información para la próxima compra
            </label>
          </div>
        </div>
        
        <div className={styles.formActions}>
          <button type="submit" className={styles.continueButton}>
            Continuar al pago
          </button>
        </div>
      </form>
    </div>
  );
}

export default ShippingForm;