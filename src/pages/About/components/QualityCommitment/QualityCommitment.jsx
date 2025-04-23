import React from 'react';
import styles from './QualityCommitment.module.css';

function QualityCommitment() {
  return (
    <section className={styles.qualitySection}>
      <h2 className={styles.sectionTitle}>Nuestro Compromiso con la Calidad</h2>
      <p className={styles.qualityText}>
        En cada paso de nuestro proceso, desde la selección de proveedores hasta la entrega final, 
        mantenemos los más altos estándares de calidad. Todos nuestros productos pasan por rigurosos controles 
        antes de llegar a tus manos, garantizando tu satisfacción.
      </p>
    </section>
  );
}

export default QualityCommitment;