import React, { useState } from 'react';
import styles from './FAQ.module.css';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const faqData = [
  {
    id: 1,
    question: "¿Cuál es el tiempo estimado de entrega?",
    answer: "Nuestros envíos suelen tardar entre 3-5 días hábiles, dependiendo de tu ubicación. Una vez realizada la compra, recibirás un correo con el número de seguimiento para que puedas monitorear tu pedido en tiempo real."
  },
  {
    id: 2,
    question: "¿Cómo puedo realizar un cambio o devolución?",
    answer: "Puedes solicitar un cambio o devolución dentro de los 30 días posteriores a tu compra. Solo necesitas conservar el empaque original y el producto en buen estado. Contacta a nuestro servicio al cliente para iniciar el proceso."
  },
  {
    id: 3,
    question: "¿Ofrecen envío gratuito?",
    answer: "Sí, todas las compras superiores a $10.000 cuentan con envío gratuito dentro del territorio nacional. Para compras menores, el costo de envío se calcula en base a la ubicación de entrega."
  },
  {
    id: 4,
    question: "¿Cuáles son los métodos de pago aceptados?",
    answer: "Aceptamos tarjetas de crédito y débito (Visa, Mastercard, American Express), PayPal, Mercado Pago y transferencias bancarias. Todas nuestras transacciones están protegidas con la más alta seguridad."
  },
  {
    id: 5,
    question: "¿Los productos tienen garantía?",
    answer: "Todos nuestros productos cuentan con garantía de fabricante. El período de garantía varía según el tipo de producto, desde 6 meses hasta 2 años. Puedes verificar la garantía específica en la descripción de cada producto."
  },
  {
    id: 6,
    question: "¿Tienen tiendas físicas?",
    answer: "Actualmente operamos principalmente de manera online, pero contamos con una tienda showroom en Buenos Aires donde puedes ver algunos de nuestros productos. Consulta los horarios de atención en la sección de contacto."
  }
];

function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className={styles.faqSection}>
      <h2 className={styles.faqTitle}>Preguntas Frecuentes</h2>
      <p className={styles.faqDescription}>
        Encuentra respuestas a las preguntas más comunes sobre nuestros productos y servicios
      </p>
      
      <div className={styles.faqContainer}>
        {faqData.map((faq, index) => (
          <div 
            key={faq.id} 
            className={`${styles.faqItem} ${activeIndex === index ? styles.active : ''}`}
          >
            <button 
              className={styles.faqQuestion}
              onClick={() => toggleAccordion(index)}
              aria-expanded={activeIndex === index}
              aria-controls={`faq-answer-${faq.id}`}
            >
              <span>{faq.question}</span>
              {activeIndex === index ? 
                <FaChevronUp className={styles.faqIcon} /> : 
                <FaChevronDown className={styles.faqIcon} />
              }
            </button>
            <div 
              id={`faq-answer-${faq.id}`}
              className={styles.faqAnswer}
              style={{ 
                maxHeight: activeIndex === index ? '500px' : '0',
                opacity: activeIndex === index ? 1 : 0,
                padding: activeIndex === index ? '0 1rem' : '0 1rem',
              }}
            >
              <p>{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className={styles.moreQuestions}>
        <h3>¿No encontraste lo que buscabas?</h3>
        <p>Estamos aquí para ayudarte. No dudes en contactarnos directamente.</p>
        <a href="#contact-form" className={styles.contactLink}>
          Contáctanos
        </a>
      </div>
    </div>
  );
}

export default FAQ;