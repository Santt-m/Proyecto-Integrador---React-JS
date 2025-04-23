import React, { useRef, useEffect } from 'react';
import styles from './WhyChooseUs.module.css';
// Importamos íconos para las tarjetas
import { FaCheckCircle, FaShippingFast, FaHeadset, FaStar, FaMoneyBillWave, FaShieldAlt } from 'react-icons/fa';

function WhyChooseUs() {
  const sectionRef = useRef(null);

  useEffect(() => {
    // Configurar la detección de visibilidad para animación
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
      <div className={styles.sectionHeader}>
        <h2 className={styles.title}>¿Por qué elegirnos?</h2>
        <p className={styles.subtitle}>Descubre las razones por las que nuestros clientes confían en nosotros</p>
      </div>
      
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.iconWrapper}>
            <FaCheckCircle className={styles.icon} />
          </div>
          <h3>Calidad Garantizada</h3>
          <p>Todos nuestros productos pasan por rigurosos controles de calidad para asegurar tu completa satisfacción.</p>
        </div>
        <div className={styles.card}>
          <div className={styles.iconWrapper}>
            <FaShippingFast className={styles.icon} />
          </div>
          <h3>Envíos Rápidos</h3>
          <p>Recibe tu pedido en tiempo récord con nuestro servicio de envío premium a cualquier parte del país.</p>
        </div>
        <div className={styles.card}>
          <div className={styles.iconWrapper}>
            <FaHeadset className={styles.icon} />
          </div>
          <h3>Atención Personalizada</h3>
          <p>Nuestro equipo de atención al cliente está disponible 24/7 para resolver todas tus dudas y consultas.</p>
        </div>
        <div className={styles.card}>
          <div className={styles.iconWrapper}>
            <FaStar className={styles.icon} />
          </div>
          <h3>Productos Exclusivos</h3>
          <p>Ofrecemos productos únicos y exclusivos que no encontrarás en otras tiendas del mercado.</p>
        </div>
        <div className={styles.card}>
          <div className={styles.iconWrapper}>
            <FaMoneyBillWave className={styles.icon} />
          </div>
          <h3>Excelente Relación Precio-Calidad</h3>
          <p>Obtén el mejor valor por tu dinero con nuestra selección de productos de alta calidad a precios justos.</p>
        </div>
        <div className={styles.card}>
          <div className={styles.iconWrapper}>
            <FaShieldAlt className={styles.icon} />
          </div>
          <h3>Compra Segura</h3>
          <p>Tus datos y transacciones están protegidos con los más altos estándares de seguridad del mercado.</p>
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;