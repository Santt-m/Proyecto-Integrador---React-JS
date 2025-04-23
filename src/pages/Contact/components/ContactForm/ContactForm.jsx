import React, { useState, useRef, useEffect } from 'react';
import styles from './ContactForm.module.css';

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef(null);
  
  useEffect(() => {
    // Configurar la detección de visibilidad para animación
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          formRef.current.classList.add(styles.visible);
        }
      },
      { threshold: 0.2 }
    );

    if (formRef.current) {
      observer.observe(formRef.current);
    }

    return () => {
      if (formRef.current) {
        observer.unobserve(formRef.current);
      }
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error al editar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'El mensaje es obligatorio';
    } else if (formData.message.trim().length < 20) {
      newErrors.message = 'El mensaje debe tener al menos 20 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Aquí se enviaría el formulario a un backend
      console.log('Formulario enviado:', formData);
      setSubmitted(true);
      
      // Resetear el formulario
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      
      // Mostrar el mensaje de éxito por 5 segundos
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    }
  };

  return (
    <div ref={formRef} className={styles.formContainer}>
      <h2 className={styles.formTitle}>Envíanos un mensaje</h2>
      
      {submitted && (
        <div className={styles.successMessage}>
          <p>¡Gracias por contactarnos! Te responderemos a la brevedad.</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className={styles.contactForm}>
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.formLabel}>
            Nombre <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`${styles.formInput} ${errors.name ? styles.inputError : ''}`}
            placeholder="Tu nombre"
          />
          {errors.name && <span className={styles.errorMessage}>{errors.name}</span>}
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.formLabel}>
            Email <span className={styles.required}>*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`${styles.formInput} ${errors.email ? styles.inputError : ''}`}
            placeholder="tu.email@ejemplo.com"
          />
          {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="phone" className={styles.formLabel}>Teléfono</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={styles.formInput}
            placeholder="(Opcional) Tu número de teléfono"
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="subject" className={styles.formLabel}>Asunto</label>
          <select
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className={styles.formSelect}
          >
            <option value="">Selecciona un asunto</option>
            <option value="consulta">Consulta general</option>
            <option value="producto">Información de producto</option>
            <option value="soporte">Soporte técnico</option>
            <option value="reclamo">Reclamo</option>
            <option value="otro">Otro</option>
          </select>
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="message" className={styles.formLabel}>
            Mensaje <span className={styles.required}>*</span>
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            className={`${styles.formTextarea} ${errors.message ? styles.inputError : ''}`}
            placeholder="Escribe tu mensaje aquí..."
            rows="6"
          ></textarea>
          {errors.message && <span className={styles.errorMessage}>{errors.message}</span>}
        </div>
        
        <button type="submit" className={styles.submitButton}>
          Enviar mensaje
        </button>
        
        <p className={styles.formDisclaimer}>
          Al enviar este formulario, aceptas nuestra política de privacidad y el tratamiento de tus datos.
        </p>
      </form>
    </div>
  );
}

export default ContactForm;