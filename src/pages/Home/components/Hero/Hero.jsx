import React from 'react';
import styles from './Hero.module.css';
import { Link } from 'react-router-dom';

function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>Bienvenido a MiTienda</h1>
        <p className={styles.heroSubtitle}>Descubre productos de calidad a los mejores precios</p>
        <Link to="/products" className={styles.heroButton}>
          Ver Productos
        </Link>
      </div>
    </section>
  );
}

export default Hero;