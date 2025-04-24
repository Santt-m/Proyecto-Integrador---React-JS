import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../components/Toast/Toast';
import SEOHead from '../../components/SEOHead/SEOHead';
import styles from './Register.module.css';
// Importamos la configuración
import config from './config.json';

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
      setError(config.validation.passwordMismatch);
      showToast(config.validation.passwordMismatch, 'error');
      return;
    }
    
    // Validar longitud de contraseña
    if (password.length < 6) {
      setError(config.validation.passwordLength);
      showToast(config.validation.passwordLength, 'error');
      return;
    }
    
    setLoading(true);
    
    try {
      await register(name, email, password);
      showToast(config.toast.success, 'success');
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
        title={config.seo.title}
        description={config.seo.description}
        keywords={config.seo.keywords}
        canonical="https://proyecto-integrador-react-js-beta.vercel.app/register"
      />
      <div className={`${styles.registerContainer} ${theme}`}>
        <div className={styles.registerCard}>
          <h2 className={styles.registerTitle}>{config.title}</h2>
          
          {error && <div className={styles.errorMessage}>{error}</div>}
          
          <form onSubmit={handleSubmit} className={styles.registerForm}>
            <div className={styles.formGroup}>
              <label htmlFor="name">{config.form.name.label}</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className={styles.input}
                placeholder={config.form.name.placeholder}
                autoComplete="name"
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="email">{config.form.email.label}</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={styles.input}
                placeholder={config.form.email.placeholder}
                autoComplete="email"
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="password">{config.form.password.label}</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={styles.input}
                placeholder={config.form.password.placeholder}
                autoComplete="new-password"
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword">{config.form.confirmPassword.label}</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={styles.input}
                placeholder={config.form.confirmPassword.placeholder}
                autoComplete="new-password"
              />
            </div>
            
            <button 
              type="submit" 
              className={styles.registerButton}
              disabled={loading}
              aria-label={config.form.submitButton.default}
            >
              {loading ? config.form.submitButton.loading : config.form.submitButton.default}
            </button>
          </form>
          
          <div className={styles.loginLink}>
            {config.loginLink.text} <Link to="/login">{config.loginLink.linkText}</Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;