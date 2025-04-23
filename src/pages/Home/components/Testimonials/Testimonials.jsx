import React, { useState, useEffect, useRef } from 'react';
import styles from './Testimonials.module.css';

function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const sectionRef = useRef(null);
  
  const testimonials = [
    {
      id: 1,
      quote: "Excelentes productos y un servicio al cliente excepcional. Siempre encuentro lo que busco y a precios competitivos.",
      author: "María G.",
      role: "Cliente desde 2022",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      id: 2,
      quote: "La calidad de los productos es increíble. Además, el envío fue más rápido de lo esperado. ¡Totalmente recomendado!",
      author: "Carlos M.",
      role: "Cliente frecuente",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      id: 3,
      quote: "Comprar aquí es siempre una experiencia positiva. El proceso es sencillo y la atención es personalizada.",
      author: "Laura T.",
      role: "Cliente Premium",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg"
    },
    {
      id: 4,
      quote: "Los productos superaron mis expectativas. Sin duda volveré a comprar y recomendaré esta tienda a todos mis amigos.",
      author: "Miguel A.",
      role: "Nuevo cliente",
      avatar: "https://randomuser.me/api/portraits/men/75.jpg"
    },
    {
      id: 5,
      quote: "El tiempo de entrega es excelente y la calidad de los productos inigualable. Una tienda que realmente piensa en sus clientes.",
      author: "Sofía R.",
      role: "Cliente fiel",
      avatar: "https://randomuser.me/api/portraits/women/90.jpg"
    }
  ];

  // Función para cambiar al siguiente testimonio
  const nextTestimonial = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
      setTimeout(() => setIsAnimating(false), 600);
    }
  };

  // Función para cambiar al testimonio anterior
  const prevTestimonial = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentIndex((prevIndex) => 
        prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
      );
      setTimeout(() => setIsAnimating(false), 600);
    }
  };

  // Cambio automático de testimonios
  useEffect(() => {
    const timer = setInterval(() => {
      nextTestimonial();
    }, 6000);

    return () => clearInterval(timer);
  }, [currentIndex]);

  // Configurar la animación de entrada
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          sectionRef.current.classList.add(styles.visible);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Lo que dicen nuestros clientes</h2>
        <p className={styles.subtitle}>Experiencias reales de quienes han confiado en nosotros</p>
        
        <div className={styles.testimonialCarousel}>
          <button 
            className={`${styles.navButton} ${styles.prevButton}`} 
            onClick={prevTestimonial}
            aria-label="Testimonio anterior"
          >
            &#10094;
          </button>
          
          <div className={styles.testimonialWrapper}>
            <div 
              className={`${styles.testimonials} ${isAnimating ? styles.animating : ''}`}
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className={styles.testimonial}>
                  <div className={styles.testimonialContent}>
                    <div className={styles.quoteIcon}>"</div>
                    <p className={styles.quote}>{testimonial.quote}</p>
                    <div className={styles.authorInfo}>
                      <img src={testimonial.avatar} alt={testimonial.author} className={styles.avatar} />
                      <div>
                        <p className={styles.author}>{testimonial.author}</p>
                        <p className={styles.role}>{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <button 
            className={`${styles.navButton} ${styles.nextButton}`} 
            onClick={nextTestimonial}
            aria-label="Siguiente testimonio"
          >
            &#10095;
          </button>
        </div>
        
        <div className={styles.indicators}>
          {testimonials.map((_, index) => (
            <span 
              key={index} 
              className={`${styles.indicator} ${index === currentIndex ? styles.activeIndicator : ''}`}
              onClick={() => {
                if (!isAnimating) {
                  setIsAnimating(true);
                  setCurrentIndex(index);
                  setTimeout(() => setIsAnimating(false), 600);
                }
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;