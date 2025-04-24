import React, { useState } from 'react';
import styles from './SocialMediaLinks.module.css';
import { 
  FaFacebookF, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedinIn, 
  FaYoutube, 
  FaPinterestP, 
  FaWhatsapp,
  FaPaperPlane
} from 'react-icons/fa';
import config from './config.json';

// Mapa de los iconos para cada red social
const socialIcons = {
  'Facebook': FaFacebookF,
  'Twitter': FaTwitter,
  'Instagram': FaInstagram,
  'LinkedIn': FaLinkedinIn,
  'YouTube': FaYoutube,
  'Pinterest': FaPinterestP
};

function SocialMediaLinks() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para suscribir al newsletter
    alert(`${config.newsletter.successMessage} ${email}`);
    setEmail('');
  };

  return (
    <div className={styles.socialContainer}>
      <h2 className={styles.socialTitle}>{config.title}</h2>
      
      <p className={styles.socialDescription}>{config.description}</p>
      
      <div className={styles.socialGrid}>
        {config.socialNetworks.map((network) => {
          const IconComponent = socialIcons[network.name];
          return (
            <a 
              key={network.name}
              href={network.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className={`${styles.socialCard} ${styles[network.className]}`}
              aria-label={network.ariaLabel}
            >
              <IconComponent className={styles.socialIcon} />
              <span className={styles.socialName}>{network.name}</span>
              <span className={styles.socialHandle}>{network.handle}</span>
            </a>
          );
        })}
      </div>
      
      <div className={styles.newsletterContainer}>
        <h3 className={styles.newsletterTitle}>{config.newsletter.title}</h3>
        <p className={styles.newsletterText}>{config.newsletter.description}</p>
        <form onSubmit={handleSubscribe} className={styles.newsletterForm}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={config.newsletter.placeholder}
            required
            className={styles.newsletterInput}
          />
          <button type="submit" className={styles.newsletterButton}>
            <FaPaperPlane />
          </button>
        </form>
      </div>
      
      <div className={styles.whatsappBanner}>
        <div className={styles.whatsappContent}>
          <FaWhatsapp className={styles.whatsappIcon} />
          <div className={styles.whatsappText}>
            <h3>{config.whatsapp.title}</h3>
            <p>{config.whatsapp.description}</p>
          </div>
        </div>
        <a 
          href={`https://wa.me/${config.whatsapp.phoneNumber}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className={styles.whatsappButton}
        >
          {config.whatsapp.buttonText}
        </a>
      </div>
    </div>
  );
}

export default SocialMediaLinks;