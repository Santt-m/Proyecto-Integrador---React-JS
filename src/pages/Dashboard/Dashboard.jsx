import React from 'react';
import { useAuth } from '../../context/AuthContext';
import SEOHead from '../../components/SEOHead/SEOHead';
import styles from './Dashboard.module.css';

function Dashboard() {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return (
      <>
        <SEOHead
          title="Acceso Restringido"
          description="Acceso al área de usuario. Inicia sesión para continuar."
          canonical="https://proyecto-integrador-react-js-beta.vercel.app/dashboard"
          robots="noindex, nofollow"
        />
        <div className={styles.dashboardError}>
          <h2>Acceso Denegado</h2>
          <p>Necesitas iniciar sesión para acceder a esta página.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead
        title="Mi Cuenta"
        description="Gestiona tu cuenta, revisa tu actividad reciente y actualiza tus datos personales."
        keywords="dashboard, cuenta de usuario, panel de usuario, área personal"
        canonical="https://proyecto-integrador-react-js-beta.vercel.app/dashboard"
        robots="noindex, nofollow"
      />
      <div className={styles.dashboardContainer}>
        <div className={styles.dashboardHeader}>
          <h1 className={styles.dashboardTitle}>Dashboard</h1>
          <p className={styles.welcomeMessage}>Bienvenido, {currentUser.name}</p>
        </div>

        <div className={styles.dashboardContent}>
          <div className={styles.dashboardCard}>
            <h2>Información Personal</h2>
            <div className={styles.userInfoContainer}>
              <div className={styles.userInfoItem}>
                <span className={styles.userInfoLabel}>Nombre:</span>
                <span className={styles.userInfoValue}>{currentUser.name}</span>
              </div>
              <div className={styles.userInfoItem}>
                <span className={styles.userInfoLabel}>Email:</span>
                <span className={styles.userInfoValue}>{currentUser.email}</span>
              </div>
            </div>
          </div>

          <div className={styles.dashboardCard}>
            <h2>Actividad Reciente</h2>
            <div className={styles.activityList}>
              <div className={styles.activityItem}>
                <span className={styles.activityDate}>Ahora</span>
                <span className={styles.activityDescription}>Has iniciado sesión en tu cuenta</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;