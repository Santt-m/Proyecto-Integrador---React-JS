import React, { useRef, useEffect } from 'react';
import styles from './Map.module.css';

function Map() {
  const mapRef = useRef(null);

  useEffect(() => {
    // Configurar la detección de visibilidad para animación
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          mapRef.current.classList.add(styles.visible);
        }
      },
      { threshold: 0.2 }
    );

    if (mapRef.current) {
      observer.observe(mapRef.current);
    }

    return () => {
      if (mapRef.current) {
        observer.unobserve(mapRef.current);
      }
    };
  }, []);

  return (
    <div ref={mapRef} className={styles.mapSection}>
      <h2 className={styles.mapTitle}>Nuestra Ubicación</h2>
      
      <div className={styles.mapContainer}>
        {/* En un caso real, aquí iría un mapa de Google Maps o similar */}
        {/* Pero para esta demostración, usamos una imagen estática */}
        <div className={styles.mockMap}>
          <img 
            src="https://maps.googleapis.com/maps/api/staticmap?center=Buenos+Aires,Argentina&zoom=14&size=800x400&key=YOUR_API_KEY" 
            alt="Ubicación de nuestra tienda" 
            className={styles.mapImage}
          />
          <div className={styles.mapMarker}>
            <span className={styles.markerPin}>📍</span>
            <span className={styles.markerLabel}>Nuestra Tienda</span>
          </div>
        </div>
        
        <div className={styles.mapInfo}>
          <p className={styles.mapText}>
            Estamos ubicados en una zona céntrica y de fácil acceso, 
            con múltiples opciones de transporte público y estacionamiento cercano.
          </p>
          <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className={styles.directionButton}>
            Cómo llegar
          </a>
        </div>
      </div>
    </div>
  );
}

export default Map;