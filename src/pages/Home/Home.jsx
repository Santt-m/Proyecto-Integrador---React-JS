import React from 'react';
import Hero from './components/Hero/Hero';
import FeaturedProducts from './components/FeaturedProducts/FeaturedProducts';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      {/* Banner principal */}
      <Hero />
      
      {/* Sección de productos destacados */}
      <FeaturedProducts />
      
      {/* Sección de información adicional */}
      <section style={{ textAlign: 'center', margin: '2rem 0' }}>
        <h2>¿Por qué elegirnos?</h2>
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          justifyContent: 'center',
          gap: 'var(--spacing-lg)',
          margin: 'var(--spacing-lg) 0'
        }}>
          <div style={{ flex: '1 1 250px', maxWidth: '300px', padding: 'var(--spacing-md)' }}>
            <h3>Calidad Garantizada</h3>
            <p>Todos nuestros productos pasan por controles de calidad rigurosos.</p>
          </div>
          <div style={{ flex: '1 1 250px', maxWidth: '300px', padding: 'var(--spacing-md)' }}>
            <h3>Envíos Rápidos</h3>
            <p>Recibe tu pedido en tiempo récord con nuestro servicio de envío premium.</p>
          </div>
          <div style={{ flex: '1 1 250px', maxWidth: '300px', padding: 'var(--spacing-md)' }}>
            <h3>Atención Personalizada</h3>
            <p>Nuestro equipo de atención al cliente está disponible para resolver tus dudas.</p>
          </div>
        </div>
      </section>
      
      {/* Nueva sección de testimonios */}
      <section style={{ 
        backgroundColor: 'var(--color-surface-light)', 
        padding: 'var(--spacing-xl) 0',
        margin: 'var(--spacing-xl) 0'
      }}>
        <div style={{ 
          maxWidth: 'var(--container-max-width)', 
          margin: '0 auto',
          padding: '0 var(--spacing-md)'
        }}>
          <h2 style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>Lo que dicen nuestros clientes</h2>
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            justifyContent: 'center',
            gap: 'var(--spacing-xl)'
          }}>
            <div style={{ 
              flex: '1 1 300px', 
              padding: 'var(--spacing-lg)',
              borderRadius: 'var(--border-radius-md)',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              backgroundColor: '#fff'
            }}>
              <p style={{ fontStyle: 'italic', marginBottom: 'var(--spacing-md)' }}>
                "Excelentes productos y un servicio al cliente excepcional. Siempre encuentro lo que busco y a precios competitivos."
              </p>
              <p style={{ fontWeight: 'bold' }}>María G.</p>
            </div>
            <div style={{ 
              flex: '1 1 300px', 
              padding: 'var(--spacing-lg)',
              borderRadius: 'var(--border-radius-md)',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              backgroundColor: '#fff'
            }}>
              <p style={{ fontStyle: 'italic', marginBottom: 'var(--spacing-md)' }}>
                "La calidad de los productos es increíble. Además, el envío fue más rápido de lo esperado. ¡Totalmente recomendado!"
              </p>
              <p style={{ fontWeight: 'bold' }}>Carlos M.</p>
            </div>
            <div style={{ 
              flex: '1 1 300px', 
              padding: 'var(--spacing-lg)',
              borderRadius: 'var(--border-radius-md)',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              backgroundColor: '#fff'
            }}>
              <p style={{ fontStyle: 'italic', marginBottom: 'var(--spacing-md)' }}>
                "Comprar aquí es siempre una experiencia positiva. El proceso es sencillo y la atención es personalizada."
              </p>
              <p style={{ fontWeight: 'bold' }}>Laura T.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Nueva sección de guía de compra */}
      <section style={{ 
        maxWidth: 'var(--container-max-width)', 
        margin: '0 auto',
        padding: 'var(--spacing-xl) var(--spacing-md)'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>¿Cómo comprar?</h2>
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          justifyContent: 'center',
          gap: 'var(--spacing-xl)'
        }}>
          <div style={{ 
            flex: '1 1 200px', 
            textAlign: 'center',
            padding: 'var(--spacing-md)'
          }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: '50%', 
              backgroundColor: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto var(--spacing-md)',
              color: 'white',
              fontSize: '1.5rem',
              fontWeight: 'bold'
            }}>1</div>
            <h3>Explora nuestros productos</h3>
            <p>Navega por nuestras categorías y encuentra lo que necesitas.</p>
          </div>
          <div style={{ 
            flex: '1 1 200px', 
            textAlign: 'center',
            padding: 'var(--spacing-md)'
          }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: '50%', 
              backgroundColor: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto var(--spacing-md)',
              color: 'white',
              fontSize: '1.5rem',
              fontWeight: 'bold'
            }}>2</div>
            <h3>Añade al carrito</h3>
            <p>Selecciona la cantidad y añade productos a tu carrito de compras.</p>
          </div>
          <div style={{ 
            flex: '1 1 200px', 
            textAlign: 'center',
            padding: 'var(--spacing-md)'
          }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: '50%', 
              backgroundColor: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto var(--spacing-md)',
              color: 'white',
              fontSize: '1.5rem',
              fontWeight: 'bold'
            }}>3</div>
            <h3>Finaliza tu compra</h3>
            <p>Completa el proceso con tus datos y método de pago preferido.</p>
          </div>
          <div style={{ 
            flex: '1 1 200px', 
            textAlign: 'center',
            padding: 'var(--spacing-md)'
          }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: '50%', 
              backgroundColor: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto var(--spacing-md)',
              color: 'white',
              fontSize: '1.5rem',
              fontWeight: 'bold'
            }}>4</div>
            <h3>Recibe en casa</h3>
            <p>¡Listo! Recibe tu pedido en la puerta de tu hogar.</p>
          </div>
        </div>
      </section>
      
      {/* Nueva sección de llamado a la acción */}
      <section style={{ 
        backgroundColor: 'var(--color-primary)',
        padding: 'var(--spacing-xl) var(--spacing-md)',
        margin: 'var(--spacing-xl) 0 0',
        color: 'white',
        textAlign: 'center'
      }}>
        <h2 style={{ marginBottom: 'var(--spacing-md)' }}>¿Listo para descubrir nuestros productos?</h2>
        <p style={{ marginBottom: 'var(--spacing-lg)', maxWidth: '700px', margin: '0 auto var(--spacing-lg)' }}>
          Explora nuestra amplia gama de productos de alta calidad y encuentra exactamente lo que estás buscando.
        </p>
        <Link to="/products" style={{ 
          display: 'inline-block',
          padding: 'var(--spacing-md) var(--spacing-lg)',
          backgroundColor: 'white',
          color: 'var(--color-primary)',
          borderRadius: 'var(--border-radius-md)',
          fontWeight: 'bold',
          textDecoration: 'none',
          transition: 'var(--transition-duration)'
        }}>
          Ver Todos los Productos
        </Link>
      </section>
    </div>
  );
}

export default Home;
