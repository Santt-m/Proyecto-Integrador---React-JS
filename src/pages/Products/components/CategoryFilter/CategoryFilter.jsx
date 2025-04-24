// src/pages/Products/components/CategoryFilter/CategoryFilter.jsx
import React from 'react';
import styles from './CategoryFilter.module.css';
import { FaLaptop, FaTshirt, FaHome, FaRunning, FaSprayCan, FaAppleAlt } from 'react-icons/fa';

const CATEGORY_ICONS = {
  tecnologia: <FaLaptop />,
  moda: <FaTshirt />,
  hogar: <FaHome />,
  deportes: <FaRunning />,
  belleza: <FaSprayCan />,
  alimentos: <FaAppleAlt />,
  // Añadir más íconos según las categorías disponibles
};

function CategoryFilter({ categories, selectedCategory, onSelectCategory }) {
  return (
    <div className={styles.categoryFilter}>
      <h3 className={styles.filterTitle}>Categorías</h3>
      <div className={styles.categoryButtons}>
        {categories.map(category => (
          <button
            key={category}
            className={`${styles.categoryButton} ${selectedCategory === category ? styles.active : ''}`}
            onClick={() => onSelectCategory(category)}
            aria-pressed={selectedCategory === category}
          >
            <span className={styles.categoryIcon}>
              {category !== 'all' && CATEGORY_ICONS[category] ? CATEGORY_ICONS[category] : '📦'}
            </span>
            <span className={styles.categoryName}>
              {category === 'all' ? 'Todas' : category.charAt(0).toUpperCase() + category.slice(1)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default CategoryFilter;