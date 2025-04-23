import React, { useRef, useEffect } from 'react';
import styles from './MissionVision.module.css';

function MissionVision() {
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
    <section ref={sectionRef} className={styles.missionVisionSection}>
      <div className={styles.missionCard}>
        <div className={styles.cardImageContainer}>
          <img 
            src="https://picsum.photos/id/292/600/400" 
            alt="Nuestra Misión" 
            className={styles.cardImage} 
          />
        </div>
        <div className={styles.cardContent}>
          <h2 className={styles.cardTitle}>Nuestra Misión</h2>
          <p className={styles.cardText}>
            Proporcionar a nuestros clientes una experiencia de compra excepcional, ofreciendo productos de alta calidad
            que satisfagan sus necesidades, con un servicio personalizado y precios competitivos.
          </p>
        </div>
      </div>
      
      <div className={styles.visionCard}>
        <div className={styles.cardImageContainer}>
          <img 
            src="https://picsum.photos/id/370/600/400" 
            alt="Nuestra Visión" 
            className={styles.cardImage} 
          />
        </div>
        <div className={styles.cardContent}>
          <h2 className={styles.cardTitle}>Nuestra Visión</h2>
          <p className={styles.cardText}>
            Ser reconocidos como líderes en el mercado, destacando por nuestra innovación, calidad de productos y 
            excelencia en el servicio al cliente, mientras contribuimos positivamente a la comunidad y al medio ambiente.
          </p>
        </div>
      </div>
    </section>
  );
}

export default MissionVision;