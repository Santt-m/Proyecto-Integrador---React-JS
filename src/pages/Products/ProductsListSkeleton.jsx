import React from 'react';
import ProductCardSkeleton from './components/ProductCard/ProductCardSkeleton';
import styles from './Products.module.css';

function ProductsListSkeleton() {
  return (
    <div className={styles.productsPage}>
      <h1 className={styles.pageTitle}>Nuestros Productos</h1>
      <div className={styles.filtersContainer}>
        {/* Puedes poner placeholders para los filtros si lo deseas */}
      </div>
      <div className={styles.productsGrid}>
        {Array(8).fill(0).map((_, index) => (
          <div key={index} className={styles.productItem}>
            <ProductCardSkeleton />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductsListSkeleton;