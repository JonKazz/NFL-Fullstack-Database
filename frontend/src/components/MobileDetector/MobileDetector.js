import React, { useState, useEffect } from 'react';
import styles from './MobileDetector.module.css';

/**
 * MobileDetector component that shows a mobile warning screen for mobile devices
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render on desktop
 * @returns {JSX.Element} MobileDetector component
 */
function MobileDetector({ children }) {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkMobile = () => {
      // Check for mobile devices using multiple methods
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      
      // Mobile device patterns
      const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
      const isMobileUserAgent = mobileRegex.test(userAgent);
      
      // Check screen size (additional check)
      const isMobileScreen = window.innerWidth <= 768;
      
      // Check for touch capability
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // Consider it mobile if it matches user agent OR (small screen AND touch device)
      const isMobileDevice = isMobileUserAgent || (isMobileScreen && isTouchDevice);
      
      setIsMobile(isMobileDevice);
      setIsLoading(false);
    };

    // Check on mount
    checkMobile();

    // Check on resize
    const handleResize = () => {
      checkMobile();
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className={styles.mobileContainer}>
        <div className={styles.mobileContent}>
          <div className={styles.logoContainer}>
            <img src="/icons/sh-logo.png" alt="NFL Logo" className={styles.logo} />
          </div>
          
          <h1 className={styles.title}>Mobile Not Supported</h1>
          
          <div className={styles.message}>
            <p className={styles.mainMessage}>
              This application is currently optimized for desktop viewing only.
            </p>
            <p className={styles.subMessage}>
              Please access this site from a desktop or laptop computer for the best experience.
            </p>
          </div>
          
          <div className={styles.features}>
            <h2 className={styles.featuresTitle}>What you'll find on desktop:</h2>
            <ul className={styles.featuresList}>
              <li>Comprehensive NFL statistics and analysis</li>
              <li>Interactive team and player data</li>
              <li>Detailed game summaries and standings</li>
              <li>Full-featured navigation and search</li>
            </ul>
          </div>
          
          <div className={styles.contact}>
            <p>Mobile support coming soon!</p>
          </div>
        </div>
      </div>
    );
  }

  // Render children for desktop
  return <>{children}</>;
}

export default MobileDetector;
