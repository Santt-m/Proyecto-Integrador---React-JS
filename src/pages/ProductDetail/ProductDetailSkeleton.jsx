import React from 'react';
import styles from './ProductDetailSkeleton.module.css';

function ProductDetailSkeleton() {
  return (
    <div className={styles.productDetailSkeleton}>
      {/* Botón de volver */}
      <div className={`${styles.backButtonSkeleton} ${styles.skeleton}`}></div>
      
      <div className={styles.productContainerSkeleton}>
        {/* Sección de imágenes */}
        <div className={styles.productImageSectionSkeleton}>
          <div className={`${styles.mainImageSkeleton} ${styles.skeleton}`}></div>
          <div className={styles.thumbnailsContainerSkeleton}>
            {[1, 2, 3].map(index => (
              <div key={index} className={`${styles.thumbnailSkeleton} ${styles.skeleton}`}></div>
            ))}
          </div>
        </div>
        
        {/* Sección de información del producto */}
        <div className={styles.productInfoSkeleton}>
          <div className={`${styles.titleSkeleton} ${styles.skeleton}`}></div>
          <div className={`${styles.metaSkeleton} ${styles.skeleton}`}></div>
          <div className={`${styles.priceSkeleton} ${styles.skeleton}`}></div>
          <div className={`${styles.ratingSkeleton} ${styles.skeleton}`}></div>
          
          {/* Descripción */}
          <div className={`${styles.descriptionHeaderSkeleton} ${styles.skeleton}`}></div>
          {[1, 2, 3, 4].map(index => (
            <div key={index} className={`${styles.descriptionSkeleton} ${styles.skeleton}`} style={{ width: `${Math.floor(Math.random() * 30) + 70}%` }}></div>
          ))}
          
          {/* Especificaciones */}
          <div className={`${styles.descriptionHeaderSkeleton} ${styles.skeleton}`}></div>
          {[1, 2, 3].map(index => (
            <div key={index} className={`${styles.descriptionSkeleton} ${styles.skeleton}`} style={{ width: `${Math.floor(Math.random() * 30) + 70}%` }}></div>
          ))}
          
          {/* Controles para agregar al carrito */}
          <div className={`${styles.quantityControlSkeleton} ${styles.skeleton}`}></div>
          <div className={`${styles.addToCartButtonSkeleton} ${styles.skeleton}`}></div>
        </div>
      </div>
      
      {/* Sección de productos relacionados */}
      <div className={styles.relatedSectionSkeleton}>
        <div className={`${styles.relatedTitleSkeleton} ${styles.skeleton}`}></div>
        <div className={styles.relatedProductsGridSkeleton}>
          {[1, 2, 3].map(index => (
            <div key={index} className={`${styles.relatedCardSkeleton} ${styles.skeleton}`}></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductDetailSkeleton;