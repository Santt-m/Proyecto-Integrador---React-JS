import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './components/ProductCard/ProductCard';
import ProductsListSkeleton from './ProductsListSkeleton';
import SEOHead from '../../components/SEOHead/SEOHead';
import { getAllProducts, getAllCategories, getAllTags } from '../../services/api';
import styles from './Products.module.css';

function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTag, setSelectedTag] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState(['all']);
  const [tags, setTags] = useState(['all']);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cargar productos, categorías y tags iniciales
    const fetchData = async () => {
      setLoading(true);
      try {
        const productsData = await getAllProducts();
        const categoriesData = await getAllCategories();
        const tagsData = await getAllTags();
        
        setProducts(productsData);
        setFilteredProducts(productsData);
        setCategories(['all', ...categoriesData]);
        setTags(['all', ...tagsData]);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  useEffect(() => {
    // Filtrar productos cuando cambie la categoría, tag, ordenamiento o término de búsqueda
    if (loading) return; // No filtrar durante la carga

    let result = [...products];

    // Filtrar por categoría
    if (selectedCategory !== 'all') {
      result = result.filter(product => product.category === selectedCategory);
    }

    // Filtrar por tag
    if (selectedTag !== 'all') {
      result = result.filter(product => 
        product.tags && product.tags.includes(selectedTag)
      );
    }

    // Filtrar por término de búsqueda
    if (searchTerm.trim() !== '') {
      const searchTermLower = searchTerm.toLowerCase().trim();
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchTermLower) || 
        product.description.toLowerCase().includes(searchTermLower)
      );
    }

    // Ordenar productos
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'rating-desc':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        // Por defecto no hace falta ordenar
        break;
    }

    setFilteredProducts(result);
  }, [selectedCategory, selectedTag, sortBy, searchTerm, products, loading]);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleTagChange = (e) => {
    setSelectedTag(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedTag('all');
    setSortBy('default');
    setSearchTerm('');
  };

  // Mostrar skeleton durante la carga
  if (loading) {
    return (
      <>
        <SEOHead
          title="Productos"
          description="Explora nuestra amplia selección de productos de alta calidad. Filtros por categoría, precio y más."
          keywords="catálogo productos, ofertas, comprar online, mejores precios"
          canonical="https://mitiendareact.com/products"
        />
        <ProductsListSkeleton />
      </>
    );
  }

  return (
    <>
      <SEOHead
        title="Productos"
        description="Explora nuestra amplia selección de productos de alta calidad. Filtros por categoría, precio y más."
        keywords="catálogo productos, ofertas, comprar online, mejores precios"
        canonical="https://mitiendareact.com/products"
      />
      <div className={styles.productsPage}>
        <h1 className={styles.pageTitle}>Nuestros Productos</h1>
        
        <div className={styles.filtersContainer}>
          <div className={styles.filterGroup}>
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={handleSearchChange}
              className={styles.searchInput}
            />
          </div>
          
          <div className={styles.filterGroup}>
            <label htmlFor="category">Categoría:</label>
            <select 
              id="category" 
              value={selectedCategory} 
              onChange={handleCategoryChange}
              className={styles.filterSelect}
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'Todas las categorías' : category}
                </option>
              ))}
            </select>
          </div>
          
          <div className={styles.filterGroup}>
            <label htmlFor="tag">Etiqueta:</label>
            <select 
              id="tag" 
              value={selectedTag} 
              onChange={handleTagChange}
              className={styles.filterSelect}
            >
              {tags.map(tag => (
                <option key={tag} value={tag}>
                  {tag === 'all' ? 'Todas las etiquetas' : tag}
                </option>
              ))}
            </select>
          </div>
          
          <div className={styles.filterGroup}>
            <label htmlFor="sort">Ordenar por:</label>
            <select 
              id="sort" 
              value={sortBy} 
              onChange={handleSortChange}
              className={styles.filterSelect}
            >
              <option value="default">Por defecto</option>
              <option value="price-asc">Precio: Menor a Mayor</option>
              <option value="price-desc">Precio: Mayor a Menor</option>
              <option value="name-asc">Nombre: A-Z</option>
              <option value="name-desc">Nombre: Z-A</option>
              <option value="rating-desc">Mejor valorados</option>
            </select>
          </div>
        </div>
        
        {filteredProducts.length === 0 ? (
          <div className={styles.noResults}>
            <p>No se encontraron productos que coincidan con tu búsqueda.</p>
            <button 
              onClick={resetFilters}
              className={styles.resetButton}
            >
              Restablecer filtros
            </button>
          </div>
        ) : (
          <div className={styles.resultsInfo}>
            <p>Mostrando {filteredProducts.length} {filteredProducts.length === 1 ? 'producto' : 'productos'}</p>
            {(selectedCategory !== 'all' || selectedTag !== 'all' || searchTerm !== '') && (
              <button 
                onClick={resetFilters}
                className={styles.smallResetButton}
              >
                Restablecer filtros
              </button>
            )}
          </div>
        )}
        
        <div className={styles.productsGrid}>
          {filteredProducts.map(product => (
            <div key={product.id} className={styles.productItem}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Products;
