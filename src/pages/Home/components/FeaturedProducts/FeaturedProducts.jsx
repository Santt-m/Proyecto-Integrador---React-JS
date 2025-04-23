import React, { useState, useEffect, useRef } from 'react';
import ProductCard from '../../../../pages/Products/components/ProductCard/ProductCard';
import FeaturedProductsSkeleton from './FeaturedProductsSkeleton';
import { getFeaturedProducts } from '../../../../services/api';
import styles from './FeaturedProducts.module.css';

function FeaturedProducts() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      setLoading(true);
      try {
        console.log('Obteniendo productos destacados...');
        const products = await getFeaturedProducts(6);
        console.log('Productos destacados obtenidos:', products);
        setFeaturedProducts(products);
      } catch (error) {
        console.error('Error cargando productos destacados:', error);
        setError('No se pudieron cargar los productos destacados');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();

    // Implementación mejorada del observer para la animación de entrada
    const handleIntersection = (entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        console.log('Sección de productos destacados es visible');
        setIsVisible(true);
        // Una vez que es visible, desconectamos el observer
        observer.unobserve(entry.target);
      }
    };

    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: '0px',
      threshold: 0.1 // Reducimos el umbral para que sea más sensible
    });

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
      console.log('Observer conectado a la sección de productos destacados');
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
        console.log('Observer desconectado');
      }
    };
  }, []);

  // Forzar visibilidad después de cierto tiempo como fallback
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isVisible) {
        console.log('Haciendo visible la sección por timeout');
        setIsVisible(true);
      }
    }, 2000); // 2 segundos después de cargar

    return () => clearTimeout(timer);
  }, [isVisible]);

  // Mostrar skeleton durante la carga
  if (loading) {
    return <FeaturedProductsSkeleton />;
  }

  // Mostrar mensaje de error si algo falló
  if (error) {
    return (
      <section 
        ref={sectionRef} 
        className={`${styles.featuredSection} ${isVisible ? styles.visible : ''}`}
        style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(20px)' }}
      >
        <h2 className={styles.sectionTitle}>Productos Destacados</h2>
        <p className={styles.errorMessage}>{error}</p>
      </section>
    );
  }

  // No mostrar nada si no hay productos destacados
  if (!featuredProducts || featuredProducts.length === 0) {
    console.log('No hay productos destacados para mostrar');
    return null;
  }

  return (
    <section 
      ref={sectionRef} 
      className={`${styles.featuredSection} ${isVisible ? styles.visible : ''}`}
      style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(20px)' }}
    >
      <h2 className={styles.sectionTitle}>Productos Destacados</h2>
      <p className={styles.sectionSubtitle}>
        Descubre nuestra selección de productos más populares y de alta calidad
      </p>
      
      <div className={styles.productsGrid}>
        {featuredProducts.slice(0, 3).map(product => (
          <div key={product.id} className={styles.productItem}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
      
      <div className={styles.seeAllContainer}>
        <a href="/products" className={styles.seeAllLink}>
          Ver todos los productos
        </a>
      </div>
    </section>
  );
}

export default FeaturedProducts;