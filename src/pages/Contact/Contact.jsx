import React from 'react';
import SEOHead from '../../components/SEOHead/SEOHead';
import ContactForm from './components/ContactForm/ContactForm';
import ContactInfo from './components/ContactInfo/ContactInfo';
import Map from './components/Map/Map';
import SocialMediaLinks from './components/SocialMediaLinks/SocialMediaLinks';
import FAQ from './components/FAQ/FAQ';
import styles from './Contact.module.css';

function Contact() {
  return (
    <>
      <SEOHead
        title="Contacto | MiTienda"
        description="Contáctanos para más información sobre nuestros productos y servicios. Estamos disponibles para ayudarte en lo que necesites."
        keywords="contacto, atención al cliente, ayuda, soporte, formulario de contacto"
      />
      
      <div className={styles.contactContainer}>
        <h1 className={styles.pageTitle}>Contacto</h1>
        
        <section className={styles.contactSection}>
          <div className={styles.contactGrid}>
            <div className={styles.contactInfoWrapper}>
              <ContactInfo />
            </div>
            
            <div className={styles.contactFormWrapper}>
              <ContactForm />
            </div>
          </div>
        </section>
        
        <section className={styles.mapSection}>
          <Map />
        </section>
        
        <section className={styles.faqSection}>
          <FAQ />
        </section>
        
        <section className={styles.socialSection}>
          <SocialMediaLinks />
        </section>
      </div>
    </>
  );
}

export default Contact;
