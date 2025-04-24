import React, { useState, useEffect, useRef } from 'react';
import ProductCard from '../../../../pages/Products/components/ProductCard/ProductCard';
import FeaturedProductsSkeleton from './FeaturedProductsSkeleton';
import { getFeaturedProducts } from '../../../../services/api';
import styles from './FeaturedProducts.module.css';

function FeaturedProducts() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(true); // Iniciar visible directamente
  const sectionRef = useRef(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      setLoading(true);
      try {
        const products = await getFeaturedProducts(6);
        setFeaturedProducts(products);
      } catch (error) {
        setError('No se pudieron cargar los productos destacados');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();

    // Implementación sutil del observer para mejorar la experiencia de scroll
    const handleIntersection = (entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        setIsVisible(true);
        // Una vez que es visible, desconectamos el observer
        observer.unobserve(entry.target);
      }
    };

    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    });

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Mostrar skeleton durante la carga
  if (loading) {
    return <FeaturedProductsSkeleton />;
  }

  // Mostrar mensaje de error si algo falló
  if (error) {
    return (
      <section 
        ref={sectionRef} 
        className={`${styles.featuredSection} ${styles.visible}`}
      >
        <h2 className={styles.sectionTitle}>Productos Destacados</h2>
        <p className={styles.errorMessage}>{error}</p>
      </section>
    );
  }

  // No mostrar nada si no hay productos destacados
  if (!featuredProducts || featuredProducts.length === 0) {
    return null;
  }

  return (
    <section 
      ref={sectionRef} 
      className={`${styles.featuredSection} ${styles.visible}`}
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