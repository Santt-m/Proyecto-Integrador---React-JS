import React, { useState, useEffect } from 'react';
import ProductCard from '../../../../pages/Products/components/ProductCard/ProductCard';
import FeaturedProductsSkeleton from './FeaturedProductsSkeleton';
import { getFeaturedProducts } from '../../../../services/api';
import styles from './FeaturedProducts.module.css';

function FeaturedProducts() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      setLoading(true);
      try {
        // Simulamos una pequeña demora para demostrar el skeleton (opcional)
        const products = await getFeaturedProducts(3);
        setFeaturedProducts(products);
      } catch (error) {
        console.error('Error cargando productos destacados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  // Mostrar skeleton durante la carga
  if (loading) {
    return <FeaturedProductsSkeleton />;
  }

  // No mostrar nada si no hay productos destacados
  if (featuredProducts.length === 0) {
    return null;
  }

  return (
    <section className={styles.featuredSection}>
      <h2 className={styles.sectionTitle}>Productos Destacados</h2>
      <div className={styles.productsGrid}>
        {featuredProducts.map(product => (
          <div key={product.id} className={styles.productItem}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeaturedProducts;