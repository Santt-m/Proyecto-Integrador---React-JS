// src/components/ImageSkeleton/ImageSkeleton.jsx
import React, { useState, useEffect } from 'react';
import styles from './ImageSkeleton.module.css';

/**
 * Componente para mostrar un esqueleto de carga mientras se carga una imagen
 * y manejar la transición suave una vez cargada
 * 
 * @param {Object} props - Props del componente
 * @param {string} props.src - URL de la imagen a cargar
 * @param {string} props.alt - Texto alternativo para la imagen (importante para accesibilidad)
 * @param {string} props.className - Clase CSS adicional para la imagen
 * @param {Function} props.onLoad - Función a llamar cuando la imagen se carga
 * @param {Function} props.onError - Función a llamar si hay un error de carga
 * @param {string} props.fallbackSrc - URL de imagen de respaldo en caso de error
 * @param {string} props.skeletonClassName - Clase CSS adicional para el esqueleto
 * @param {boolean} props.lazyLoad - Si se debe utilizar carga perezosa (lazy loading) (por defecto true)
 * @param {string} props.borderRadius - Radio de borde para aplicar al contenedor y a la imagen
 * @param {string} props.height - Altura para aplicar al contenedor
 * @param {string} props.width - Ancho para aplicar al contenedor
 */
function ImageSkeleton({
  src,
  alt,
  className = '',
  onLoad,
  onError,
  fallbackSrc = '/placeholder-image.jpg',
  skeletonClassName = '',
  lazyLoad = true,
  borderRadius,
  height,
  width,
  ...props
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);

  // Reiniciar estados si cambia la fuente de la imagen
  useEffect(() => {
    if (src !== imageSrc) {
      setLoaded(false);
      setError(false);
      setImageSrc(src);
    }
  }, [src, imageSrc]);

  const handleLoad = () => {
    setLoaded(true);
    if (onLoad) onLoad();
  };

  const handleError = () => {
    setError(true);
    if (fallbackSrc && fallbackSrc !== src) {
      setImageSrc(fallbackSrc);
    }
    if (onError) onError();
  };

  // Aplicamos los estilos al contenedor en lugar de directamente al elemento img
  const containerStyle = {
    ...(borderRadius ? { borderRadius } : {}),
    ...(height ? { height } : {}),
    ...(width ? { width } : {})
  };

  return (
    <div 
      className={`${styles.skeletonContainer} ${skeletonClassName}`}
      aria-busy={!loaded && !error}
      role="img"
      aria-label={alt || "Imagen cargando"}
      style={containerStyle}
    >
      {/* Esqueleto animado mostrado durante la carga */}
      {!loaded && !error && (
        <div 
          className={styles.skeleton} 
          aria-hidden="true"
          style={containerStyle}
        >
          <div className={styles.pulse}></div>
        </div>
      )}

      {/* La imagen real que se está cargando */}
      <img
        src={imageSrc}
        alt={alt || ""}
        className={`${styles.image} ${loaded ? styles.loaded : styles.loading} ${className}`}
        onLoad={handleLoad}
        onError={handleError}
        loading={lazyLoad ? "lazy" : "eager"}
        // Excluimos las propiedades problemáticas que ya aplicamos al contenedor
        {...(Object.keys(props).reduce((acc, key) => {
          if (!['borderRadius', 'height', 'width'].includes(key)) {
            acc[key] = props[key];
          }
          return acc;
        }, {}))}
      />
    </div>
  );
}

export default ImageSkeleton;