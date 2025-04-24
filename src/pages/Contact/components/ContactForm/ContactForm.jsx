import React, { useState } from 'react';
import { sendContactForm } from '../../../../services/api';
import styles from './ContactForm.module.css';
import { FaUser, FaEnvelope, FaPhone, FaComment, FaPaperPlane } from 'react-icons/fa';

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const validateForm = () => {
    const newErrors = {};
    
    // Validar nombre
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }
    
    // Validar email
    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Dirección de email inválida';
    }
    
    // Validar teléfono (opcional pero si se proporciona debe ser válido)
    if (formData.phone && !/^[0-9+\- ]{8,15}$/.test(formData.phone)) {
      newErrors.phone = 'Número de teléfono inválido';
    }
    
    // Validar asunto
    if (!formData.subject.trim()) {
      newErrors.subject = 'El asunto es obligatorio';
    }
    
    // Validar mensaje
    if (!formData.message.trim()) {
      newErrors.message = 'El mensaje es obligatorio';
    } else if (formData.message.trim().length < 20) {
      newErrors.message = 'El mensaje debe tener al menos 20 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error al cambiar el valor
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    setSubmitError('');
    
    try {
      const result = await sendContactForm(formData);
      if (result.success) {
        setSubmitSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
        
        // Restablecer el éxito después de 5 segundos
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 5000);
      } else {
        setSubmitError('Ha ocurrido un error al enviar el formulario. Inténtalo de nuevo.');
      }
    } catch (error) {
      setSubmitError('Ha ocurrido un error al enviar el formulario. Inténtalo de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.contactFormContainer}>
      <h2 className={styles.formTitle}>Escríbenos</h2>
      
      {submitSuccess && (
        <div className={styles.successMessage}>
          <p>¡Gracias por contactarnos! Tu mensaje ha sido enviado con éxito. Nos pondremos en contacto contigo pronto.</p>
        </div>
      )}
      
      {submitError && (
        <div className={styles.errorMessage}>
          <p>{submitError}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className={styles.contactForm}>
        <div className={styles.formGroup}>
          <div className={styles.inputWithIcon}>
            <FaUser className={styles.inputIcon} />
            <input
              type="text"
              name="name"
              placeholder="Nombre completo"
              value={formData.name}
              onChange={handleChange}
              className={`${styles.formInput} ${errors.name ? styles.inputError : ''}`}
              disabled={submitting}
            />
          </div>
          {errors.name && <p className={styles.errorText}>{errors.name}</p>}
        </div>
        
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <div className={styles.inputWithIcon}>
              <FaEnvelope className={styles.inputIcon} />
              <input
                type="email"
                name="email"
                placeholder="Correo electrónico"
                value={formData.email}
                onChange={handleChange}
                className={`${styles.formInput} ${errors.email ? styles.inputError : ''}`}
                disabled={submitting}
              />
            </div>
            {errors.email && <p className={styles.errorText}>{errors.email}</p>}
          </div>
          
          <div className={styles.formGroup}>
            <div className={styles.inputWithIcon}>
              <FaPhone className={styles.inputIcon} />
              <input
                type="tel"
                name="phone"
                placeholder="Teléfono (opcional)"
                value={formData.phone}
                onChange={handleChange}
                className={`${styles.formInput} ${errors.phone ? styles.inputError : ''}`}
                disabled={submitting}
              />
            </div>
            {errors.phone && <p className={styles.errorText}>{errors.phone}</p>}
          </div>
        </div>
        
        <div className={styles.formGroup}>
          <div className={styles.inputWithIcon}>
            <FaComment className={styles.inputIcon} />
            <input
              type="text"
              name="subject"
              placeholder="Asunto"
              value={formData.subject}
              onChange={handleChange}
              className={`${styles.formInput} ${errors.subject ? styles.inputError : ''}`}
              disabled={submitting}
            />
          </div>
          {errors.subject && <p className={styles.errorText}>{errors.subject}</p>}
        </div>
        
        <div className={styles.formGroup}>
          <textarea
            name="message"
            placeholder="Tu mensaje (mínimo 20 caracteres)"
            value={formData.message}
            onChange={handleChange}
            className={`${styles.formTextarea} ${errors.message ? styles.inputError : ''}`}
            rows="6"
            disabled={submitting}
          />
          {errors.message && <p className={styles.errorText}>{errors.message}</p>}
        </div>
        
        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={submitting}
        >
          {submitting ? (
            <span className={styles.loadingSpinner}></span>
          ) : (
            <>
              <FaPaperPlane className={styles.submitIcon} />
              <span>Enviar mensaje</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default ContactForm;