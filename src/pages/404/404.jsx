import React from 'react';
import { Link } from 'react-router-dom';

function NotFound404() {
  return (
    <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
      <h1>404 - Página No Encontrada</h1>
      <p>Lo sentimos, la página que buscas no existe.</p>
      <Link to="/">Volver al Inicio</Link>
    </div>
  );
}

export default NotFound404;
