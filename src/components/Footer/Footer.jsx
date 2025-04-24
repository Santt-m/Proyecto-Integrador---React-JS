// src/components/Footer/Footer.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock, 
         FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, 
         FaYoutube, FaPaperPlane, FaCcVisa, FaCcMastercard, FaCcAmex, FaCcPaypal } from 'react-icons/fa';
import { SiMercadopago } from 'react-icons/si';
import styles from './Footer.module.css';
// Importamos la configuración
import config from './config.json';

function Footer() {
  const { theme } = useTheme();
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para suscribir al newsletter
    alert(`${config.newsletter.subscribeSuccess} ${email}`);
    setEmail('');
  };

  return (
    <footer className={`${styles.footer} ${theme === 'dark' ? styles.darkFooter : ''}`}>
      <div className={styles.footerContainer}>
        <div className={styles.footerMain}>
          {/* Columna 1: Información de contacto */}
          <div className={styles.footerColumn}>
            <h3>{config.contact.title}</h3>
            <ul className={styles.contactInfo}>
              <li>
                <span className={styles.contactIcon}><FaMapMarkerAlt /></span>
                <span>{config.contact.address}</span>
              </li>
              <li>
                <span className={styles.contactIcon}><FaPhoneAlt /></span>
                <span>{config.contact.phone}</span>
              </li>
              <li>
                <span className={styles.contactIcon}><FaEnvelope /></span>
                <span>{config.contact.email}</span>
              </li>
              <li>
                <span className={styles.contactIcon}><FaClock /></span>
                <span>{config.contact.hours}</span>
              </li>
            </ul>
          </div>

          {/* Columna 2: Enlaces rápidos */}
          <div className={styles.footerColumn}>
            <h3>{config.quickLinks.title}</h3>
            <ul className={styles.footerLinks}>
              <li><Link to="/">{config.quickLinks.home}</Link></li>
              <li><Link to="/products">{config.quickLinks.products}</Link></li>
              <li><Link to="/about">{config.quickLinks.about}</Link></li>
              <li><Link to="/contact">{config.quickLinks.contact}</Link></li>
              <li><Link to="/login">{config.quickLinks.account}</Link></li>
              <li><Link to="/dashboard">{config.quickLinks.dashboard}</Link></li>
            </ul>
          </div>

          {/* Columna 3: Categorías */}
          <div className={styles.footerColumn}>
            <h3>{config.categories.title}</h3>
            <ul className={styles.footerLinks}>
              <li><Link to="/products?category=tecnologia">{config.categories.technology}</Link></li>
              <li><Link to="/products?category=moda">{config.categories.fashion}</Link></li>
              <li><Link to="/products?category=hogar">{config.categories.home}</Link></li>
              <li><Link to="/products?category=deportes">{config.categories.sports}</Link></li>
              <li><Link to="/products?category=belleza">{config.categories.beauty}</Link></li>
              <li><Link to="/products?category=alimentos">{config.categories.food}</Link></li>
            </ul>
          </div>

          {/* Columna 4: Newsletter */}
          <div className={styles.footerColumn}>
            <h3>{config.newsletter.title}</h3>
            <p>{config.newsletter.description}</p>
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
            <div className={styles.socialLinks}>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
                <FaFacebookF />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
                <FaTwitter />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
                <FaInstagram />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
                <FaLinkedinIn />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
                <FaYoutube />
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className={styles.footerBottom}>
          <div className={styles.copyright}>
            &copy; {currentYear} {config.copyright}
          </div>
          
          <div className={styles.legalLinks}>
            <Link to="/terms">{config.legalLinks.terms}</Link>
            <Link to="/privacy">{config.legalLinks.privacy}</Link>
            <Link to="/shipping">{config.legalLinks.shipping}</Link>
            <Link to="/returns">{config.legalLinks.returns}</Link>
          </div>
          
          <div className={styles.paymentMethods}>
            <FaCcVisa size={28} className={styles.paymentIcon} />
            <FaCcMastercard size={28} className={styles.paymentIcon} />
            <FaCcAmex size={28} className={styles.paymentIcon} />
            <FaCcPaypal size={28} className={styles.paymentIcon} />
            <SiMercadopago size={28} className={styles.paymentIcon} />
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
