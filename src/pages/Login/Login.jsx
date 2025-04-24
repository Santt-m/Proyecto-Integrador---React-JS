import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../components/Toast/Toast';
import SEOHead from '../../components/SEOHead/SEOHead';
import styles from './Login.module.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const { theme } = useTheme();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await login(email, password);
      showToast('¡Bienvenido de nuevo!', 'success');
      navigate('/');
    } catch (error) {
      setError(error.message);
      showToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEOHead
        title="Iniciar Sesión"
        description="Inicia sesión en tu cuenta para acceder a ofertas exclusivas, realizar compras y gestionar tus pedidos."
        keywords="login, iniciar sesión, acceso, cuenta usuario"
        canonical="https://proyecto-integrador-react-js-beta.vercel.app/login"
      />
      <div className={`${styles.loginContainer} ${theme}`}>
        <div className={styles.loginCard}>
          <h2 className={styles.loginTitle}>Iniciar Sesión</h2>
          
          {error && <div className={styles.errorMessage}>{error}</div>}
          
          <form onSubmit={handleSubmit} className={styles.loginForm}>
            <div className={styles.formGroup}>
              <label htmlFor="email">Correo Electrónico</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={styles.input}
                placeholder="tucorreo@ejemplo.com"
                autoComplete="email"
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={styles.input}
                placeholder="Tu contraseña"
                autoComplete="current-password"
              />
            </div>
            
            <button 
              type="submit" 
              className={styles.loginButton}
              disabled={loading}
              aria-label="Iniciar sesión"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>
          
          <div className={styles.registerLink}>
            ¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;