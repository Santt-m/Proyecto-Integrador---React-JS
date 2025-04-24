import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './components/ProductCard/ProductCard';
import CategoryFilter from './components/CategoryFilter/CategoryFilter';
import ProductsListSkeleton from './ProductsListSkeleton';
import SEOHead from '../../components/SEOHead/SEOHead';
import { getAllProducts, getAllCategories, getAllTags } from '../../services/api';
import styles from './Products.module.css';

function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTag, setSelectedTag] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState(['all']);
  const [tags, setTags] = useState(['all']);
  const [loading, setLoading] = useState(true);
  const [productsPerPage, setProductsPerPage] = useState(6);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const observer = useRef();
  const lastProductRef = useRef();

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
    // Reiniciar la paginación cuando cambian los filtros
    setProductsPerPage(6);
    setHasMore(result.length > 6);
  }, [selectedCategory, selectedTag, sortBy, searchTerm, products, loading]);

  // Actualizar productos mostrados cuando cambia la lista filtrada o la cantidad a mostrar
  useEffect(() => {
    const productsToShow = filteredProducts.slice(0, productsPerPage);
    setDisplayedProducts(productsToShow);
    setHasMore(productsPerPage < filteredProducts.length);
  }, [filteredProducts, productsPerPage]);

  // Configurar el observador de scroll
  const lastProductElementRef = useCallback(node => {
    if (loadingMore) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMoreProducts();
      }
    }, { threshold: 0.5 });
    
    if (node) observer.current.observe(node);
  }, [hasMore, loadingMore]);

  // Función para cargar más productos
  const loadMoreProducts = () => {
    if (!hasMore || loadingMore) return;
    
    setLoadingMore(true);
    // Simular retraso para mostrar el efecto de carga
    setTimeout(() => {
      setProductsPerPage(prev => prev + 6);
      setLoadingMore(false);
    }, 500);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
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
        
        {/* Componente de filtro de categorías visual */}
        <CategoryFilter 
          categories={categories} 
          selectedCategory={selectedCategory} 
          onSelectCategory={handleCategoryChange} 
        />
        
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
            <p>Mostrando {displayedProducts.length} de {filteredProducts.length} {filteredProducts.length === 1 ? 'producto' : 'productos'}</p>
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
          {displayedProducts.map((product, index) => (
            <div 
              key={product.id} 
              className={styles.productItem}
              ref={index === displayedProducts.length - 1 ? lastProductElementRef : null}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
        
        {loadingMore && (
          <div className={styles.loadingMoreContainer}>
            <div className={styles.loadingSpinner}></div>
            <p>Cargando más productos...</p>
          </div>
        )}
        
        {!hasMore && filteredProducts.length > 6 && (
          <div className={styles.endOfResults}>
            <p>Has llegado al final de los resultados</p>
          </div>
        )}
      </div>
    </>
  );
}

export default Products;
