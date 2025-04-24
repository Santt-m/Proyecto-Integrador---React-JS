// src/components/ImageSkeleton/ImageSkeleton.jsx
import React from 'react';
import styles from './ImageSkeleton.module.css';

function ImageSkeleton({ width = '100%', height = '200px', borderRadius = '4px' }) {
  return (
    <div 
      className={styles.imageSkeleton} 
      style={{ 
        width, 
        height, 
        borderRadius 
      }}
    >
      <div className={styles.shimmer}></div>
    </div>
  );
}

export default ImageSkeleton;