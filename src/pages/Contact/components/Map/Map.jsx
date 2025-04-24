import React from 'react';
import styles from './Map.module.css';
import { FaMapMarkerAlt, FaDirections } from 'react-icons/fa';

function Map() {
  return (
    <div className={styles.mapContainer}>
      <h2 className={styles.mapTitle}>Nuestra Ubicación</h2>
      
      <div className={styles.mapWrapper}>
        <div className={styles.mapOverlay}>
          <div className={styles.locationCard}>
            <h3>Tienda Principal</h3>
            <p>Av. Corrientes 1234</p>
            <p>CABA, Argentina</p>
            <a 
              href="https://www.google.com/maps?q=Av.+Corrientes+1234,+CABA,+Argentina" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.directionLink}
            >
              <FaDirections /> Cómo llegar
            </a>
          </div>
        </div>
        
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3283.984369270803!2d-58.38669082424979!3d-34.60406657295666!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bccac630121623%3A0x53386f2ac88991a9!2sAv.+Corrientes+1200%2C+C1043AAZ+CABA!5e0!3m2!1ses!2sar!4v1566568155542!5m2!1ses!2sar"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Ubicación de nuestra tienda"
          className={styles.mapIframe}
        ></iframe>
      </div>
    </div>
  );
}

export default Map;