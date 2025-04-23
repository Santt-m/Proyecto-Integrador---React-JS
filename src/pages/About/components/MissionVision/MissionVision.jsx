import React from 'react';
import styles from './MissionVision.module.css';

function MissionVision() {
  return (
    <section className={styles.missionVisionSection}>
      <div className={styles.missionCard}>
        <h2 className={styles.cardTitle}>Nuestra Misión</h2>
        <p className={styles.cardText}>
          Proporcionar a nuestros clientes una experiencia de compra excepcional, ofreciendo productos de alta calidad
          que satisfagan sus necesidades, con un servicio personalizado y precios competitivos.
        </p>
      </div>
      <div className={styles.visionCard}>
        <h2 className={styles.cardTitle}>Nuestra Visión</h2>
        <p className={styles.cardText}>
          Ser reconocidos como líderes en el mercado, destacando por nuestra innovación, calidad de productos y 
          excelencia en el servicio al cliente, mientras contribuimos positivamente a la comunidad y al medio ambiente.
        </p>
      </div>
    </section>
  );
}

export default MissionVision;