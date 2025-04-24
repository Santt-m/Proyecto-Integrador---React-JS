import React, { useEffect, useRef } from 'react';
import SEOHead from '../../components/SEOHead/SEOHead';
import OurHistory from './components/OurHistory/OurHistory';
import MissionVision from './components/MissionVision/MissionVision';
import OurValues from './components/OurValues/OurValues';
import OurTeam from './components/OurTeam/OurTeam';
import QualityCommitment from './components/QualityCommitment/QualityCommitment';
import styles from './About.module.css';

function About() {
  const titleRef = useRef(null);

  useEffect(() => {
    // Scroll a la parte superior cuando se carga la página
    window.scrollTo(0, 0);
    
    // Animación para el título principal usando ref
    if (titleRef.current) {
      titleRef.current.classList.add(styles.visible);
    }
  }, []);

  return (
    <>
      <SEOHead
        title="Nosotros"
        description="Conoce nuestra historia, misión, visión y valores. Descubre por qué somos la tienda de confianza para miles de clientes."
        keywords="historia empresa, misión, visión, valores, equipo, compromiso con calidad"
        canonical="https://proyecto-integrador-react-js-beta.vercel.app/about"
      />
      <div className={styles.aboutPage}>
        <div className={styles.pageTitleContainer}>
          <h1 className={styles.pageTitle} ref={titleRef}>Nosotros</h1>
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
    </>
  );
}

export default About;
