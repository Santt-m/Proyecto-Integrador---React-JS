import React from 'react';
import styles from './OurValues.module.css';

function OurValues() {
  const values = [
    {
      title: 'Calidad',
      description: 'Nos comprometemos a ofrecer siempre productos de la más alta calidad, cuidadosamente seleccionados.'
    },
    {
      title: 'Integridad',
      description: 'Actuamos con honestidad y transparencia en todas nuestras operaciones y relaciones comerciales.'
    },
    {
      title: 'Innovación',
      description: 'Buscamos constantemente nuevas maneras de mejorar nuestros productos y servicios.'
    },
    {
      title: 'Servicio',
      description: 'Nuestro compromiso es brindar la mejor experiencia y atención a cada uno de nuestros clientes.'
    }
  ];

  return (
    <section className={styles.valuesSection}>
      <h2 className={styles.sectionTitle}>Nuestros Valores</h2>
      <div className={styles.valuesGrid}>
        {values.map((value, index) => (
          <div key={index} className={styles.valueCard}>
            <h3 className={styles.valueTitle}>{value.title}</h3>
            <p className={styles.valueDescription}>{value.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default OurValues;