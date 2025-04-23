import React from 'react';
import ProductCardSkeleton from '../../../../pages/products/components/ProductCard/ProductCardSkeleton';
import styles from './FeaturedProducts.module.css';

function FeaturedProductsSkeleton() {
  return (
    <section className={styles.featuredSection}>
      <h2 className={styles.sectionTitle}>Productos Destacados</h2>
      <div className={styles.productsGrid}>
        {/* Renderizar 3 skeletons para productos destacados */}
        {Array(3).fill(0).map((_, index) => (
          <div key={index} className={styles.productItem}>
            <ProductCardSkeleton />
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeaturedProductsSkeleton;