import React from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../../components/SEOHead/SEOHead';

function NotFound404() {
  return (
    <>
      <SEOHead
        title="Página no encontrada"
        description="Lo sentimos, la página que estás buscando no existe o ha sido movida."
        keywords="error 404, página no encontrada, not found"
        canonical="https://proyecto-integrador-react-js-beta.vercel.app/404"
      />
      <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
        <h1>404 - Página No Encontrada</h1>
        <p>Lo sentimos, la página que buscas no existe.</p>
        <Link to="/">Volver al Inicio</Link>
      </div>
    </>
  );
}

export default NotFound404;
