import React, { useRef, useEffect } from 'react';
import styles from './OurValues.module.css';

function OurValues() {
  const sectionRef = useRef(null);
  
  // Array con los valores e imágenes correspondientes
  const values = [
    {
      title: 'Calidad',
      description: 'Nos comprometemos a ofrecer siempre productos de la más alta calidad, cuidadosamente seleccionados.',
      imageUrl: 'https://picsum.photos/id/175/300/200'
    },
    {
      title: 'Integridad',
      description: 'Actuamos con honestidad y transparencia en todas nuestras operaciones y relaciones comerciales.',
      imageUrl: 'https://picsum.photos/id/541/300/200'
    },
    {
      title: 'Innovación',
      description: 'Buscamos constantemente nuevas maneras de mejorar nuestros productos y servicios.',
      imageUrl: 'https://picsum.photos/id/217/300/200'
    },
    {
      title: 'Servicio',
      description: 'Nuestro compromiso es brindar la mejor experiencia y atención a cada uno de nuestros clientes.',
      imageUrl: 'https://picsum.photos/id/328/300/200'
    }
  ];

  useEffect(() => {
    // Configurar la detección de visibilidad para animación
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          sectionRef.current.classList.add(styles.visible);
          
          // Añadimos una animación en cascada para cada tarjeta
          const cards = sectionRef.current.querySelectorAll(`.${styles.valueCard}`);
          cards.forEach((card, index) => {
            setTimeout(() => {
              card.classList.add(styles.visible);
            }, 200 * index);
          });
        }
      },
      { threshold: 0.1 }
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
    <section ref={sectionRef} className={styles.valuesSection}>
      <h2 className={styles.sectionTitle}>Nuestros Valores</h2>
      <div className={styles.valuesGrid}>
        {values.map((value, index) => (
          <div key={index} className={styles.valueCard}>
            <div className={styles.cardImage}>
              <img src={value.imageUrl} alt={value.title} />
            </div>
            <div className={styles.cardContent}>
              <h3 className={styles.valueTitle}>{value.title}</h3>
              <p className={styles.valueDescription}>{value.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default OurValues;