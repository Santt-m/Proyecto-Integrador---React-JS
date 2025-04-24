import React, { useEffect, useRef } from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa';
import { ThemeContext } from '../../../../context/ThemeContext';
import { useContext } from 'react';
import styles from './ContactInfo.module.css';

const ContactInfo = () => {
  const { darkMode } = useContext(ThemeContext);
  const contactInfoRef = useRef(null);
  
  const contactDetails = [
    {
      icon: <FaMapMarkerAlt />,
      title: 'Dirección',
      details: 'Av. Corrientes 1234, CABA, Argentina',
      action: 'Ver en mapa'
    },
    {
      icon: <FaPhone />,
      title: 'Teléfono',
      details: '+54 11 5555-5555',
      action: 'Llamar ahora'
    },
    {
      icon: <FaEnvelope />,
      title: 'Correo electrónico',
      details: 'info@techmundo.com.ar',
      action: 'Enviar correo'
    },
    {
      icon: <FaClock />,
      title: 'Horarios',
      details: 'Lunes a Viernes: 9am - 6pm | Sábados: 10am - 2pm',
      action: null
    }
  ];

  useEffect(() => {
    // Animar la entrada de los elementos
    if (contactInfoRef.current) {
      const items = contactInfoRef.current.querySelectorAll(`.${styles.contactDetailItem}`);
      items.forEach((item, index) => {
        setTimeout(() => {
          item.style.opacity = '1';
          item.style.transform = 'translateY(0)';
        }, 100 * index);
      });
    }
  }, []);

  const getActionUrl = (contactType, details) => {
    switch(contactType) {
      case 'Dirección':
        return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(details)}`;
      case 'Teléfono':
        return `tel:${details.replace(/[^0-9+]/g, '')}`;
      case 'Correo electrónico':
        return `mailto:${details}`;
      default:
        return null;
    }
  };

  return (
    <div className={`${styles.contactInfoContainer} ${darkMode ? styles.dark : ''}`} ref={contactInfoRef}>
      <h2 className={styles.contactInfoTitle}>Información de Contacto</h2>
      <p className={styles.contactInfoDescription}>
        Estamos aquí para ayudarte. No dudes en ponerte en contacto con nosotros si tienes alguna pregunta o necesitas asistencia.
      </p>
      
      <div className={styles.contactDetailsList}>
        {contactDetails.map((contact, index) => (
          <div 
            key={index} 
            className={styles.contactDetailItem}
            style={{ opacity: 0, transform: 'translateY(20px)', transition: 'opacity 0.5s ease, transform 0.5s ease' }}
          >
            <div className={styles.contactIcon}>
              {contact.icon}
            </div>
            <div className={styles.contactContent}>
              <h3 className={styles.contactTitle}>{contact.title}</h3>
              <p className={styles.contactDetail}>{contact.details}</p>
              {contact.action && (
                <a 
                  href={getActionUrl(contact.title, contact.details)}
                  className={styles.contactAction}
                  target={contact.title === 'Dirección' ? '_blank' : '_self'}
                  rel={contact.title === 'Dirección' ? 'noopener noreferrer' : ''}
                >
                  {contact.action}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactInfo;