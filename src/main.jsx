import React from 'react'
import ReactDOM from 'react-dom/client'
import AppRouter from './routes/AppRouter'
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './components/Toast/Toast'; // Importar el ToastProvider
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <CartProvider>
        <ToastProvider> {/* Agregar ToastProvider alrededor de AppRouter */}
          <AppRouter />
        </ToastProvider>
      </CartProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
