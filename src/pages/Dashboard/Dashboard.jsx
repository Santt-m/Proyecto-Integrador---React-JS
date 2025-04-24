import React from 'react';
import { useAuth } from '../../context/AuthContext';
import styles from './Dashboard.module.css';

function Dashboard() {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return (
      <div className={styles.dashboardError}>
        <h2>Acceso Denegado</h2>
        <p>Necesitas iniciar sesión para acceder a esta página.</p>
      </div>
    );
  }

  return (
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
  );
}

export default Dashboard;