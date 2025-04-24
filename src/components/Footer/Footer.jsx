// src/components/Footer/Footer.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock, 
         FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, 
         FaYoutube, FaPaperPlane, FaCcVisa, FaCcMastercard, FaCcAmex, FaCcPaypal } from 'react-icons/fa';
import { SiMercadopago } from 'react-icons/si';
import styles from './Footer.module.css';

function Footer() {
  const { theme } = useTheme();
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para suscribir al newsletter
    alert(`Gracias por suscribirte con: ${email}`);
    setEmail('');
  };

  return (
    <footer className={`${styles.footer} ${theme === 'dark' ? styles.darkFooter : ''}`}>
      <div className={styles.footerContainer}>
        <div className={styles.footerMain}>
          {/* Columna 1: Información de contacto */}
          <div className={styles.footerColumn}>
            <h3>Contacto</h3>
            <ul className={styles.contactInfo}>
              <li>
                <span className={styles.contactIcon}><FaMapMarkerAlt /></span>
                <span>Av. Libertador 1234, Buenos Aires, Argentina</span>
              </li>
              <li>
                <span className={styles.contactIcon}><FaPhoneAlt /></span>
                <span>+54 11 5678-9012</span>
              </li>
              <li>
                <span className={styles.contactIcon}><FaEnvelope /></span>
                <span>info@mitiendareact.com</span>
              </li>
              <li>
                <span className={styles.contactIcon}><FaClock /></span>
                <span>Lun - Vie: 9:00 AM - 6:00 PM</span>
              </li>
            </ul>
          </div>

          {/* Columna 2: Enlaces rápidos */}
          <div className={styles.footerColumn}>
            <h3>Enlaces Rápidos</h3>
            <ul className={styles.footerLinks}>
              <li><Link to="/">Inicio</Link></li>
              <li><Link to="/products">Productos</Link></li>
              <li><Link to="/about">Acerca de</Link></li>
              <li><Link to="/contact">Contacto</Link></li>
              <li><Link to="/login">Mi cuenta</Link></li>
              <li><Link to="/dashboard">Panel de usuario</Link></li>
            </ul>
          </div>

          {/* Columna 3: Categorías */}
          <div className={styles.footerColumn}>
            <h3>Categorías</h3>
            <ul className={styles.footerLinks}>
              <li><Link to="/products?category=tecnologia">Tecnología</Link></li>
              <li><Link to="/products?category=moda">Moda</Link></li>
              <li><Link to="/products?category=hogar">Hogar</Link></li>
              <li><Link to="/products?category=deportes">Deportes</Link></li>
              <li><Link to="/products?category=belleza">Belleza</Link></li>
              <li><Link to="/products?category=alimentos">Alimentos</Link></li>
            </ul>
          </div>

          {/* Columna 4: Newsletter */}
          <div className={styles.footerColumn}>
            <h3>Newsletter</h3>
            <p>Suscríbete para recibir nuestras últimas novedades y ofertas especiales.</p>
            <form onSubmit={handleSubscribe} className={styles.newsletterForm}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Tu email"
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
            &copy; {currentYear} MiTienda React | Proyecto Integrador - Todos los derechos reservados
          </div>
          
          <div className={styles.legalLinks}>
            <Link to="/terms">Términos y Condiciones</Link>
            <Link to="/privacy">Política de Privacidad</Link>
            <Link to="/shipping">Política de Envíos</Link>
            <Link to="/returns">Devoluciones</Link>
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
