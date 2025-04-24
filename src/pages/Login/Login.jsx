import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../components/Toast/Toast';
import SEOHead from '../../components/SEOHead/SEOHead';
import styles from './Login.module.css';
// Importamos la configuración
import config from './config.json';

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
      showToast(config.toast.welcome, 'success');
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
        canonical="https://proyecto-integrador-react-js-beta.vercel.app/login"
      />
      <div className={`${styles.loginContainer} ${theme}`}>
        <div className={styles.loginCard}>
          <h2 className={styles.loginTitle}>{config.title}</h2>
          
          {error && <div className={styles.errorMessage}>{error}</div>}
          
          <form onSubmit={handleSubmit} className={styles.loginForm}>
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
                autoComplete="current-password"
              />
            </div>
            
            <button 
              type="submit" 
              className={styles.loginButton}
              disabled={loading}
              aria-label={config.form.submitButton.default}
            >
              {loading ? config.form.submitButton.loading : config.form.submitButton.default}
            </button>
          </form>
          
          <div className={styles.registerLink}>
            {config.registerLink.text} <Link to="/register">{config.registerLink.linkText}</Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;