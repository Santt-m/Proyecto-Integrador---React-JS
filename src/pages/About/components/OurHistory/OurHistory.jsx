import React from 'react';
import styles from './OurHistory.module.css';

function OurHistory() {
  return (
    <section className={styles.historySection}>
      <h2 className={styles.sectionTitle}>Nuestra Historia</h2>
      <div className={styles.contentContainer}>
        <div className={styles.textContent}>
          <p className={styles.paragraph}>
            Fundada en 2020, nuestra tienda nació con una visión clara: ofrecer productos de alta calidad a precios accesibles, 
            con un servicio al cliente excepcional.
          </p>
          <p className={styles.paragraph}>
            Lo que comenzó como un pequeño emprendimiento familiar, ha crecido hasta convertirse en un referente del mercado,
            manteniendo siempre nuestros valores de honestidad, calidad y servicio como pilares fundamentales.
          </p>
          <p className={styles.paragraph}>
            A lo largo de estos años, hemos evolucionado constantemente, adaptándonos a las necesidades cambiantes de nuestros
            clientes y del mercado, pero sin olvidar nunca nuestro compromiso con la excelencia.
          </p>
        </div>
        <div className={styles.imageContainer}>
          [Imagen de la tienda o fundadores]
        </div>
      </div>
    </section>
  );
}

export default OurHistory;