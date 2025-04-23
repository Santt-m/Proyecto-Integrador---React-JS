// src/components/Footer/Footer.jsx
import React from 'react';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <p>&copy; {currentYear} Mi Tienda E-commerce. Todos los derechos reservados.</p>
      <div>
        <a href="/terms">Términos</a>
        <a href="/privacy">Privacidad</a>
      </div>
    </footer>
  );
}

export default Footer;
