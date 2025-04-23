import React from 'react';
import styles from './ProductCardSkeleton.module.css';

function ProductCardSkeleton() {
  return (
    <div className={styles.skeletonCard}>
      <div className={`${styles.skeletonImage} ${styles.skeleton}`}></div>
      <div className={styles.skeletonInfo}>
        <div className={`${styles.skeletonTitle} ${styles.skeleton}`}></div>
        <div className={`${styles.skeletonPrice} ${styles.skeleton}`}></div>
        <div className={`${styles.skeletonButton} ${styles.skeleton}`}></div>
      </div>
    </div>
  );
}

export default ProductCardSkeleton;