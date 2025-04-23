import React, { useRef, useEffect } from 'react';
import styles from './CallToAction.module.css';
import { Link } from 'react-router-dom';

function CallToAction() {
  const sectionRef = useRef(null);

  useEffect(() => {
    // Configurar la detección de visibilidad para animación
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          sectionRef.current.classList.add(styles.visible);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.background}></div>
      <div className={styles.content}>
        <h2 className={styles.title}>¿Listo para descubrir nuestra colección?</h2>
        <p className={styles.description}>
          Explora nuestra selección de productos exclusivos diseñados para mejorar tu estilo de vida.
          Calidad, diseño y satisfacción garantizada en cada compra.
        </p>
        <div className={styles.buttonGroup}>
          <Link to="/products" className={`${styles.button} ${styles.primaryButton}`}>
            Ver Todos los Productos
          </Link>
          <Link to="/contact" className={`${styles.button} ${styles.secondaryButton}`}>
            Contactar con Nosotros
          </Link>
        </div>
        <div className={styles.features}>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>🚚</span>
            <span className={styles.featureText}>Envío gratis</span>
          </div>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>🔄</span>
            <span className={styles.featureText}>Devoluciones sin costo</span>
          </div>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>🔒</span>
            <span className={styles.featureText}>Pago seguro</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CallToAction;