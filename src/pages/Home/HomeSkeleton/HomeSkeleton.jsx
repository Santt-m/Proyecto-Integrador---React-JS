import React from 'react';
import styles from './HomeSkeleton.module.css';

function HomeSkeleton() {
  return (
    <div>
      {/* Hero Skeleton */}
      <section className={styles.heroSkeleton}>
        <div className={`${styles.heroContentSkeleton}`}>
          <div className={`${styles.heroTitleSkeleton} ${styles.skeleton}`}></div>
          <div className={`${styles.heroSubtitleSkeleton} ${styles.skeleton}`}></div>
          <div className={styles.buttonGroupSkeleton}>
            <div className={`${styles.buttonSkeleton} ${styles.skeleton}`}></div>
            <div className={`${styles.buttonSkeleton} ${styles.skeleton}`}></div>
          </div>
        </div>
      </section>

      {/* Featured Products Skeleton */}
      <section className={styles.sectionSkeleton}>
        <div className={`${styles.sectionTitleSkeleton} ${styles.skeleton}`}></div>
        <div className={styles.cardsSkeleton}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className={styles.cardSkeleton}>
              <div className={`${styles.cardImageSkeleton} ${styles.skeleton}`}></div>
              <div className={`${styles.cardTitleSkeleton} ${styles.skeleton}`}></div>
              <div className={`${styles.cardDescriptionSkeleton} ${styles.skeleton}`}></div>
              <div className={`${styles.cardDescriptionSkeleton} ${styles.skeleton}`}></div>
              <div className={`${styles.cardPriceSkeleton} ${styles.skeleton}`}></div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us Skeleton */}
      <section className={styles.sectionSkeleton}>
        <div className={`${styles.sectionTitleSkeleton} ${styles.skeleton}`}></div>
        <div className={styles.cardsSkeleton}>
          {[...Array(3)].map((_, i) => (
            <div key={i} className={styles.cardSkeleton}>
              <div className={`${styles.cardImageSkeleton} ${styles.skeleton}`}></div>
              <div className={`${styles.cardTitleSkeleton} ${styles.skeleton}`}></div>
              <div className={`${styles.cardDescriptionSkeleton} ${styles.skeleton}`}></div>
              <div className={`${styles.cardDescriptionSkeleton} ${styles.skeleton}`}></div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Skeleton */}
      <section className={styles.sectionSkeleton}>
        <div className={`${styles.sectionTitleSkeleton} ${styles.skeleton}`}></div>
        <div className={styles.testimonialsSkeleton}>
          {[...Array(3)].map((_, i) => (
            <div key={i} className={`${styles.testimonialSkeleton} ${styles.skeleton}`}>
              <div className={`${styles.testimonialTextSkeleton} ${styles.skeleton}`}></div>
              <div className={`${styles.testimonialAuthorSkeleton} ${styles.skeleton}`}></div>
            </div>
          ))}
        </div>
      </section>

      {/* How To Buy Skeleton */}
      <section className={styles.sectionSkeleton}>
        <div className={`${styles.sectionTitleSkeleton} ${styles.skeleton}`}></div>
        <div className={styles.howToBuySkeleton}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className={styles.stepSkeleton}>
              <div className={`${styles.stepIconSkeleton} ${styles.skeleton}`}></div>
              <div className={`${styles.stepTitleSkeleton} ${styles.skeleton}`}></div>
              <div className={`${styles.stepDescriptionSkeleton} ${styles.skeleton}`}></div>
            </div>
          ))}
        </div>
      </section>

      {/* Call To Action Skeleton */}
      <section className={`${styles.sectionSkeleton} ${styles.ctaSkeleton}`}>
        <div className={`${styles.ctaTitleSkeleton} ${styles.skeleton}`}></div>
        <div className={`${styles.ctaButtonSkeleton} ${styles.skeleton}`}></div>
      </section>
    </div>
  );
}

export default HomeSkeleton;