import React, { useState, useRef, useEffect } from 'react';
import styles from './FAQ.module.css';

function FAQ() {
  const faqRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    // Configurar la detección de visibilidad para animación
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          faqRef.current.classList.add(styles.visible);
        }
      },
      { threshold: 0.2 }
    );

    if (faqRef.current) {
      observer.observe(faqRef.current);
    }

    return () => {
      if (faqRef.current) {
        observer.unobserve(faqRef.current);
      }
    };
  }, []);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqItems = [
    {
      question: '¿Cuál es el tiempo de respuesta a mis consultas?',
      answer: 'Nos comprometemos a responder todas las consultas dentro de las 24 horas hábiles. Para consultas urgentes, recomendamos contactarnos por teléfono.'
    },
    {
      question: '¿Cómo puedo recibir soporte técnico para un producto?',
      answer: 'Puede contactarnos a través del formulario de contacto seleccionando "Soporte técnico" en el campo de asunto, o llamando directamente a nuestra línea de soporte técnico en horario comercial.'
    },
    {
      question: '¿Tienen atención presencial?',
      answer: 'Sí, contamos con atención presencial en nuestra oficina durante el horario comercial indicado. Recomendamos agendar una cita previa para una mejor atención.'
    },
    {
      question: '¿Cómo puedo presentar una queja o reclamo?',
      answer: 'Puede enviarnos un mensaje a través del formulario de contacto seleccionando "Reclamo" en el campo de asunto, o comunicarse directamente con nuestro departamento de atención al cliente.'
    },
    {
      question: '¿Trabajan con empresas o solo con particulares?',
      answer: 'Trabajamos tanto con clientes particulares como con empresas. Para proyectos empresariales o compras mayoristas, ofrecemos condiciones especiales y un asesor dedicado.'
    }
  ];

  return (
    <div ref={faqRef} className={styles.faqSection}>
      <h2 className={styles.faqTitle}>Preguntas Frecuentes</h2>
      
      <div className={styles.faqContainer}>
        {faqItems.map((item, index) => (
          <div 
            key={index}
            className={`${styles.faqItem} ${activeIndex === index ? styles.active : ''}`}
          >
            <div 
              className={styles.faqQuestion}
              onClick={() => toggleFAQ(index)}
            >
              <h3>{item.question}</h3>
              <span className={styles.faqIcon}>
                {activeIndex === index ? '−' : '+'}
              </span>
            </div>
            <div className={styles.faqAnswer}>
              <p>{item.answer}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className={styles.faqFooter}>
        <p>
          ¿No encuentras respuesta a tu pregunta? <a href="#contact-form" className={styles.faqLink}>Contáctanos</a>
        </p>
      </div>
    </div>
  );
}

export default FAQ;