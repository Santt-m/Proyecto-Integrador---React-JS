import React, { useRef, useEffect } from 'react';
import styles from './QualityCommitment.module.css';

function QualityCommitment() {
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
    <section ref={sectionRef} className={styles.qualitySection}>
      <div className={styles.qualityContent}>
        <h2 className={styles.sectionTitle}>Nuestro Compromiso con la Calidad</h2>
        <p className={styles.qualityText}>
          En cada paso de nuestro proceso, desde la selección de proveedores hasta la entrega final, 
          mantenemos los más altos estándares de calidad. Todos nuestros productos pasan por rigurosos controles 
          antes de llegar a tus manos, garantizando tu satisfacción.
        </p>
        <div className={styles.qualityHighlights}>
          <div className={styles.qualityItem}>
            <span className={styles.qualityIcon}>✓</span>
            <p>Materiales de primera calidad</p>
          </div>
          <div className={styles.qualityItem}>
            <span className={styles.qualityIcon}>✓</span>
            <p>Pruebas de durabilidad</p>
          </div>
          <div className={styles.qualityItem}>
            <span className={styles.qualityIcon}>✓</span>
            <p>Control de calidad exhaustivo</p>
          </div>
        </div>
      </div>
      <div className={styles.qualityImage}>
        <img src="https://picsum.photos/id/48/600/400" alt="Compromiso con la calidad" />
      </div>
    </section>
  );
}

export default QualityCommitment;