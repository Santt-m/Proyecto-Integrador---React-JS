import React from 'react';
import { useAuth } from '../../context/AuthContext';
import SEOHead from '../../components/SEOHead/SEOHead';
import styles from './Dashboard.module.css';
import config from './config.json';

function Dashboard() {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return (
      <>
        <SEOHead
          title={config.seo.accessDenied.title}
          description={config.seo.accessDenied.description}
          canonical="https://proyecto-integrador-react-js-beta.vercel.app/dashboard"
          robots={config.seo.accessDenied.robots}
        />
        <div className={styles.dashboardError}>
          <h2>{config.accessDenied.title}</h2>
          <p>{config.accessDenied.message}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead
        title={config.seo.dashboard.title}
        description={config.seo.dashboard.description}
        keywords={config.seo.dashboard.keywords}
        canonical="https://proyecto-integrador-react-js-beta.vercel.app/dashboard"
        robots={config.seo.dashboard.robots}
      />
      <div className={styles.dashboardContainer}>
        <div className={styles.dashboardHeader}>
          <h1 className={styles.dashboardTitle}>{config.dashboard.title}</h1>
          <p className={styles.welcomeMessage}>{config.dashboard.welcome}, {currentUser.name}</p>
        </div>

        <div className={styles.dashboardContent}>
          <div className={styles.dashboardCard}>
            <h2>{config.dashboard.personalInfo.title}</h2>
            <div className={styles.userInfoContainer}>
              <div className={styles.userInfoItem}>
                <span className={styles.userInfoLabel}>{config.dashboard.personalInfo.name}</span>
                <span className={styles.userInfoValue}>{currentUser.name}</span>
              </div>
              <div className={styles.userInfoItem}>
                <span className={styles.userInfoLabel}>{config.dashboard.personalInfo.email}</span>
                <span className={styles.userInfoValue}>{currentUser.email}</span>
              </div>
            </div>
          </div>

          <div className={styles.dashboardCard}>
            <h2>{config.dashboard.recentActivity.title}</h2>
            <div className={styles.activityList}>
              <div className={styles.activityItem}>
                <span className={styles.activityDate}>{config.dashboard.recentActivity.loginActivity.time}</span>
                <span className={styles.activityDescription}>{config.dashboard.recentActivity.loginActivity.description}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;