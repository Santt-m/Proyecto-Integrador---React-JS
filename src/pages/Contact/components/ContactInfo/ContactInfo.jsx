import React, { useRef, useEffect } from 'react';
import styles from './ContactInfo.module.css';

function ContactInfo() {
  const infoRef = useRef(null);

  useEffect(() => {
    // Configurar la detección de visibilidad para animación
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          infoRef.current.classList.add(styles.visible);
        }
      },
      { threshold: 0.2 }
    );

    if (infoRef.current) {
      observer.observe(infoRef.current);
    }

    return () => {
      if (infoRef.current) {
        observer.unobserve(infoRef.current);
      }
    };
  }, []);

  return (
    <div ref={infoRef} className={styles.infoContainer}>
      <h2 className={styles.infoTitle}>Información de Contacto</h2>
      
      <div className={styles.infoContent}>
        <div className={styles.infoItem}>
          <div className={styles.iconContainer}>
            <i className={styles.icon}>📍</i>
          </div>
          <div className={styles.infoDetails}>
            <h3 className={styles.infoSubtitle}>Dirección</h3>
            <p className={styles.infoText}>
              Av. Libertador 1234<br />
              Piso 5, Oficina 501<br />
              Buenos Aires, Argentina
            </p>
          </div>
        </div>
        
        <div className={styles.infoItem}>
          <div className={styles.iconContainer}>
            <i className={styles.icon}>📞</i>
          </div>
          <div className={styles.infoDetails}>
            <h3 className={styles.infoSubtitle}>Teléfono</h3>
            <p className={styles.infoText}>
              +54 11 4567-8900<br />
              +54 11 4567-8901
            </p>
          </div>
        </div>
        
        <div className={styles.infoItem}>
          <div className={styles.iconContainer}>
            <i className={styles.icon}>✉️</i>
          </div>
          <div className={styles.infoDetails}>
            <h3 className={styles.infoSubtitle}>Email</h3>
            <p className={styles.infoText}>
              info@mitienda.com<br />
              soporte@mitienda.com
            </p>
          </div>
        </div>
        
        <div className={styles.infoItem}>
          <div className={styles.iconContainer}>
            <i className={styles.icon}>🕒</i>
          </div>
          <div className={styles.infoDetails}>
            <h3 className={styles.infoSubtitle}>Horario de Atención</h3>
            <p className={styles.infoText}>
              Lunes a Viernes: 9:00 - 18:00<br />
              Sábados: 10:00 - 14:00<br />
              Domingos y Feriados: Cerrado
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactInfo;