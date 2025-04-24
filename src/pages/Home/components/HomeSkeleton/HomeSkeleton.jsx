// src/pages/Home/HomeSkeleton/HomeSkeleton.jsx
import React from 'react';
import styles from './HomeSkeleton.module.css';

function HomeSkeleton() {
  return (
    <div className={styles.skeleton}>
      {/* Hero skeleton */}
      <div className={styles.heroSkeleton}>
        <div className={styles.heroBanner}></div>
      </div>
      
      {/* Featured products skeleton */}
      <div className={styles.sectionSkeleton}>
        <div className={styles.sectionTitle}></div>
        <div className={styles.productsGrid}>
          {[...Array(4)].map((_, index) => (
            <div key={index} className={styles.productCard}>
              <div className={styles.productImage}></div>
              <div className={styles.productTitle}></div>
              <div className={styles.productPrice}></div>
              <div className={styles.productButton}></div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Why choose us skeleton */}
      <div className={styles.sectionSkeleton}>
        <div className={styles.sectionTitle}></div>
        <div className={styles.featuresGrid}>
          {[...Array(3)].map((_, index) => (
            <div key={index} className={styles.featureCard}>
              <div className={styles.featureIcon}></div>
              <div className={styles.featureTitle}></div>
              <div className={styles.featureDescription}></div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Testimonials skeleton */}
      <div className={styles.sectionSkeleton}>
        <div className={styles.sectionTitle}></div>
        <div className={styles.testimonialsContainer}>
          {[...Array(2)].map((_, index) => (
            <div key={index} className={styles.testimonialCard}>
              <div className={styles.testimonialAvatar}></div>
              <div className={styles.testimonialContent}></div>
              <div className={styles.testimonialAuthor}></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomeSkeleton;