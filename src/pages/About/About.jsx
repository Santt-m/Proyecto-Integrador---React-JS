import React from 'react';
import OurHistory from './components/OurHistory/OurHistory';
import MissionVision from './components/MissionVision/MissionVision';
import OurValues from './components/OurValues/OurValues';
import OurTeam from './components/OurTeam/OurTeam';
import QualityCommitment from './components/QualityCommitment/QualityCommitment';
import styles from './About.module.css';

function About() {
  return (
    <div className={styles.aboutPage}>
      <h1 className={styles.pageTitle}>Nosotros</h1>
      
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
