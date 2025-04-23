import React, { useRef, useEffect } from 'react';
import styles from './HowToBuy.module.css';
import { BsSearch, BsCart3, BsCreditCard2Front, BsBoxSeam } from 'react-icons/bs';

function HowToBuy() {
  const sectionRef = useRef(null);

  useEffect(() => {
    // Configurar la detección de visibilidad para animación
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          sectionRef.current.classList.add(styles.visible);
          
          // Agregar clase de animación a cada paso con retraso
          const steps = sectionRef.current.querySelectorAll(`.${styles.step}`);
          steps.forEach((step, index) => {
            setTimeout(() => {
              step.classList.add(styles.stepVisible);
            }, 300 * index);
          });
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
      <div className={styles.sectionHeader}>
        <h2 className={styles.title}>¿Cómo comprar?</h2>
        <p className={styles.subtitle}>Comprar en nuestra tienda es rápido, seguro y sencillo</p>
      </div>
      
      <div className={styles.stepsContainer}>
        <div className={styles.progressLine}></div>
        
        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepIconContainer}>
              <BsSearch className={styles.stepIcon} />
            </div>
            <div className={styles.stepContent}>
              <h3 className={styles.stepTitle}>1. Explora nuestros productos</h3>
              <p className={styles.stepDescription}>
                Navega por nuestras categorías y encuentra los productos que mejor se adapten a tus necesidades. 
                Puedes filtrar por categoría, precio o valoraciones.
              </p>
            </div>
          </div>
          
          <div className={styles.step}>
            <div className={styles.stepIconContainer}>
              <BsCart3 className={styles.stepIcon} />
            </div>
            <div className={styles.stepContent}>
              <h3 className={styles.stepTitle}>2. Añade al carrito</h3>
              <p className={styles.stepDescription}>
                Selecciona la cantidad deseada y añade los productos a tu carrito de compras. 
                Puedes revisar y modificar tu carrito en cualquier momento.
              </p>
            </div>
          </div>
          
          <div className={styles.step}>
            <div className={styles.stepIconContainer}>
              <BsCreditCard2Front className={styles.stepIcon} />
            </div>
            <div className={styles.stepContent}>
              <h3 className={styles.stepTitle}>3. Finaliza tu compra</h3>
              <p className={styles.stepDescription}>
                Completa el proceso con tus datos personales, dirección de envío y método de pago preferido. 
                Todas las transacciones están protegidas con los más altos estándares de seguridad.
              </p>
            </div>
          </div>
          
          <div className={styles.step}>
            <div className={styles.stepIconContainer}>
              <BsBoxSeam className={styles.stepIcon} />
            </div>
            <div className={styles.stepContent}>
              <h3 className={styles.stepTitle}>4. Recibe en casa</h3>
              <p className={styles.stepDescription}>
                ¡Listo! Recibe tu pedido en la dirección indicada. Puedes hacer seguimiento en tiempo real 
                del estado de tu envío desde tu cuenta.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className={styles.cta}>
        <p className={styles.ctaText}>¿Estás listo para comenzar a comprar?</p>
        <a href="/products" className={styles.ctaButton}>Explorar productos</a>
      </div>
    </section>
  );
}

export default HowToBuy;