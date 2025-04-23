import React, { useEffect, useState } from 'react';
import styles from './Hero.module.css';
import { Link } from 'react-router-dom';

function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Efecto de animación al cargar
    setIsVisible(true);
  }, []);

  return (
    <section className={`${styles.hero} ${isVisible ? styles.visible : ''}`}>
      <div className={styles.heroOverlay}></div>
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>Descubre Nuestra Colección Premium</h1>
        <p className={styles.heroSubtitle}>
          Productos exclusivos seleccionados para mejorar tu estilo de vida
        </p>
        <div className={styles.buttonGroup}>
          <Link to="/products" className={`${styles.heroButton} ${styles.primaryButton}`}>
            Explorar Productos
          </Link>
          <Link to="/contact" className={`${styles.heroButton} ${styles.secondaryButton}`}>
            Contactar Asesor
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Hero;