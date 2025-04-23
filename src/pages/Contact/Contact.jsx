import React from 'react';
import styles from './Contact.module.css';
import ContactForm from './components/ContactForm/ContactForm';
import ContactInfo from './components/ContactInfo/ContactInfo';
import Map from './components/Map/Map';
import FAQ from './components/FAQ/FAQ';
import SocialMediaLinks from './components/SocialMediaLinks/SocialMediaLinks';

function Contact() {
  return (
    <div className={styles.contactContainer}>
      <h1 className={styles.pageTitle}>Contacto</h1>
      
      <div className={styles.contactHeader}>
        <p className={styles.contactIntro}>
          Estamos aquí para ayudarte. No dudes en ponerte en contacto con nosotros 
          utilizando cualquiera de los métodos a continuación.
        </p>
      </div>
      
      <div className={styles.contactMainContent}>
        <div className={styles.formSection}>
          <ContactForm />
        </div>
        
        <div className={styles.infoSection}>
          <ContactInfo />
        </div>
      </div>
      
      <div className={styles.mapSection}>
        <Map />
      </div>
      
      <div className={styles.faqSection}>
        <FAQ />
      </div>
      
      <div className={styles.socialSection}>
        <SocialMediaLinks />
      </div>
    </div>
  );
}

export default Contact;
