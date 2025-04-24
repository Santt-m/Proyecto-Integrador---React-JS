import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../components/Toast/Toast';
import SEOHead from '../../components/SEOHead/SEOHead';
import styles from './Register.module.css';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register } = useAuth();
  const { theme } = useTheme();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      showToast('Las contraseñas no coinciden', 'error');
      return;
    }
    
    // Validar longitud de contraseña
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      showToast('La contraseña debe tener al menos 6 caracteres', 'error');
      return;
    }
    
    setLoading(true);
    
    try {
      await register(name, email, password);
      showToast('¡Registro exitoso! Bienvenido/a.', 'success');
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
        title="Crear Cuenta"
        description="Regístrate para acceder a todas las funciones de nuestra tienda. Compra más rápido, accede a ofertas exclusivas y haz seguimiento de tus pedidos."
        keywords="registro, crear cuenta, cuenta nueva, sign up, cliente nuevo"
        canonical="https://proyecto-integrador-react-js-beta.vercel.app/register"
      />
      <div className={`${styles.registerContainer} ${theme}`}>
        <div className={styles.registerCard}>
          <h2 className={styles.registerTitle}>Crear Cuenta</h2>
          
          {error && <div className={styles.errorMessage}>{error}</div>}
          
          <form onSubmit={handleSubmit} className={styles.registerForm}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Nombre Completo</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className={styles.input}
                placeholder="Tu nombre completo"
                autoComplete="name"
              />
            </div>
            
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
                placeholder="Mínimo 6 caracteres"
                autoComplete="new-password"
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword">Confirmar Contraseña</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={styles.input}
                placeholder="Repetir contraseña"
                autoComplete="new-password"
              />
            </div>
            
            <button 
              type="submit" 
              className={styles.registerButton}
              disabled={loading}
              aria-label="Crear cuenta"
            >
              {loading ? 'Registrando...' : 'Registrarse'}
            </button>
          </form>
          
          <div className={styles.loginLink}>
            ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;