import React, { useRef, useEffect } from 'react';
import styles from './SocialMediaLinks.module.css';

function SocialMediaLinks() {
  const socialRef = useRef(null);

  useEffect(() => {
    // Configurar la detección de visibilidad para animación
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          socialRef.current.classList.add(styles.visible);
        }
      },
      { threshold: 0.2 }
    );

    if (socialRef.current) {
      observer.observe(socialRef.current);
    }

    return () => {
      if (socialRef.current) {
        observer.unobserve(socialRef.current);
      }
    };
  }, []);

  const socialNetworks = [
    {
      name: 'Facebook',
      icon: '📘',
      url: 'https://facebook.com/mitienda',
      color: '#3b5998'
    },
    {
      name: 'Instagram',
      icon: '📸',
      url: 'https://instagram.com/mitienda',
      color: '#c13584'
    },
    {
      name: 'Twitter',
      icon: '🐦',
      url: 'https://twitter.com/mitienda',
      color: '#1da1f2'
    },
    {
      name: 'YouTube',
      icon: '🎬',
      url: 'https://youtube.com/mitienda',
      color: '#ff0000'
    },
    {
      name: 'LinkedIn',
      icon: '💼',
      url: 'https://linkedin.com/company/mitienda',
      color: '#0077b5'
    }
  ];

  return (
    <div ref={socialRef} className={styles.socialSection}>
      <h2 className={styles.socialTitle}>Síguenos en Redes Sociales</h2>
      
      <p className={styles.socialText}>
        Mantente al día con nuestras últimas novedades, promociones y contenido exclusivo.
      </p>
      
      <div className={styles.socialLinks}>
        {socialNetworks.map((network, index) => (
          <a 
            key={index} 
            href={network.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.socialLink}
            style={{'--social-color': network.color}}
          >
            <span className={styles.socialIcon}>{network.icon}</span>
            <span className={styles.socialName}>{network.name}</span>
          </a>
        ))}
      </div>
      
      <div className={styles.newsletterContainer}>
        <h3 className={styles.newsletterTitle}>Suscríbete a nuestro Newsletter</h3>
        <p className={styles.newsletterText}>
          Recibe las últimas novedades y ofertas exclusivas directamente en tu correo.
        </p>
        
        <form className={styles.newsletterForm}>
          <input 
            type="email" 
            placeholder="Tu correo electrónico" 
            className={styles.newsletterInput} 
            required
          />
          <button type="submit" className={styles.newsletterButton}>
            Suscribirse
          </button>
        </form>
      </div>
    </div>
  );
}

export default SocialMediaLinks;