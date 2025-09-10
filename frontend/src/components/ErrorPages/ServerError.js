import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ServerError.module.css';

const ServerError = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className={styles.pageBackground}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <img src="/icons/sh-logo.png" alt="NFL Logo" className={styles.logo} />
            <h1 className={styles.title}>500</h1>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.errorContent}>
            <div className={styles.errorCode}>500</div>
            <h2 className={styles.errorTitle}>Server Error</h2>
            <p className={styles.message}>
              Something went wrong on our end. 
              Please try again later or contact support if the problem persists.
            </p>
            <div className={styles.actions}>
              <button 
                className={styles.primaryButton} 
                onClick={handleRetry}
              >
                Try Again
              </button>
              <button 
                className={styles.secondaryButton} 
                onClick={handleGoHome}
              >
                Go Home
              </button>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>What You Can Do</h3>
          <div className={styles.helpContent}>
            <div className={styles.helpItem}>
              <img src="/icons/td.png" alt="Try Again" className={styles.helpIcon} />
              <h4>Try Again</h4>
              <p>Sometimes a simple refresh can get things back on track.</p>
            </div>
            <div className={styles.helpItem}>
              <img src="/icons/fg.png" alt="Go Home" className={styles.helpIcon} />
              <h4>Go Home</h4>
              <p>Return to the homepage and try a different path.</p>
            </div>
            <div className={styles.helpItem}>
              <img src="/icons/int.png" alt="Contact Support" className={styles.helpIcon} />
              <h4>Contact Support</h4>
              <p>If the problem persists, our team can help you out.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServerError;
