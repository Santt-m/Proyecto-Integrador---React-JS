// src/components/SEOHead/SEOHead.jsx
import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * Componente para gestionar metadatos SEO dinámicos para cada página
 * @param {Object} props - Propiedades del componente
 * @param {string} props.title - Título de la página
 * @param {string} props.description - Descripción de la página para metatags
 * @param {string} props.keywords - Palabras clave separadas por comas
 * @param {string} props.image - URL de la imagen para compartir en redes sociales (opcional)
 * @param {string} props.canonical - URL canónica de la página (opcional)
 * @param {string} props.type - Tipo de contenido (website, article, etc.) (opcional)
 */
function SEOHead({ 
  title, 
  description, 
  keywords, 
  image = '/og-image.jpg', 
  canonical, 
  type = 'website'
}) {
  return (
    <Helmet>
      {/* Título de la página */}
      <title>{title ? `${title} | Mi Tienda React` : 'Mi Tienda React - Tu Tienda Online de Confianza'}</title>
      
      {/* Meta etiquetas básicas */}
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content="Mi Tienda React" />
      <meta name="robots" content="index, follow" />
      
      {/* URL canónica */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      {canonical && <meta property="og:url" content={canonical} />}
      <meta property="og:title" content={title || 'Mi Tienda React - Tu Tienda Online de Confianza'} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      {canonical && <meta property="twitter:url" content={canonical} />}
      <meta property="twitter:title" content={title || 'Mi Tienda React - Tu Tienda Online de Confianza'} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
    </Helmet>
  );
}

export default SEOHead;