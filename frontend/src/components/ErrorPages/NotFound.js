import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './NotFound.module.css';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className={styles.pageBackground}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <img src="/icons/sh-logo.png" alt="NFL Logo" className={styles.logo} />
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.errorContent}>
            <div className={styles.errorCode}>404</div>
            <h2 className={styles.errorTitle}>Page Not Found</h2>
            <p className={styles.message}>
              The page you're looking for doesn't exist or has been moved.
            </p>
            <div className={styles.actions}>
              <button 
                className={styles.primaryButton} 
                onClick={handleGoHome}
              >
                Go Home
              </button>
              <button 
                className={styles.secondaryButton} 
                onClick={handleGoBack}
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
