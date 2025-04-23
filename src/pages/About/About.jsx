import React, { useEffect } from 'react';
import OurHistory from './components/OurHistory/OurHistory';
import MissionVision from './components/MissionVision/MissionVision';
import OurValues from './components/OurValues/OurValues';
import OurTeam from './components/OurTeam/OurTeam';
import QualityCommitment from './components/QualityCommitment/QualityCommitment';
import styles from './About.module.css';

function About() {
  useEffect(() => {
    // Scroll a la parte superior cuando se carga la página
    window.scrollTo(0, 0);
    
    // Animación para el título principal
    const titleElement = document.querySelector(`.${styles.pageTitle}`);
    if (titleElement) {
      titleElement.classList.add(styles.visible);
    }
  }, []);

  return (
    <div className={styles.aboutPage}>
      <div className={styles.pageTitleContainer}>
        <h1 className={styles.pageTitle}>Nosotros</h1>
        <div className={styles.pageTitleUnderline}></div>
      </div>
      
      {/* Componente de Historia */}
      <OurHistory />
      
      {/* Componente de Misión y Visión */}
      <MissionVision />
      
      {/* Componente de Valores */}
      <OurValues />
      
      {/* Componente del Equipo */}
      <OurTeam />
      
      {/* Componente de Compromiso con la Calidad */}
      <QualityCommitment />
    </div>
  );
}

export default About;
