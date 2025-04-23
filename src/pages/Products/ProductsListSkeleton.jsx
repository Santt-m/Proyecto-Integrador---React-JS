import React from 'react';
import ProductCardSkeleton from '../../components/ProductCard/ProductCardSkeleton';
import styles from './ProductsListSkeleton.module.css';

function ProductsListSkeleton({ count = 8 }) {
  return (
    <div className={styles.productsSkeleton}>
      {/* Título */}
      <div className={`${styles.titleSkeleton} ${styles.skeleton}`}></div>
      
      {/* Sección de filtros */}
      <div className={styles.filtersContainerSkeleton}>
        {/* Buscador */}
        <div className={`${styles.filterGroupSkeleton} ${styles.skeleton}`}></div>
        
        {/* Categorías */}
        <div className={`${styles.filterGroupSkeleton} ${styles.skeleton}`}></div>
        
        {/* Etiquetas */}
        <div className={`${styles.filterGroupSkeleton} ${styles.skeleton}`}></div>
        
        {/* Ordenamiento */}
        <div className={`${styles.filterGroupSkeleton} ${styles.skeleton}`}></div>
      </div>
      
      {/* Grilla de productos */}
      <div className={styles.productsGridSkeleton}>
        {Array(count).fill(0).map((_, index) => (
          <div key={index}>
            <ProductCardSkeleton />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductsListSkeleton;