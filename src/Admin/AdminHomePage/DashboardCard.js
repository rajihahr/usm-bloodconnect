import React from 'react';
import styles from './AdminDashboard.module.css';
import { Link } from 'react-router-dom';

export function DashboardCard({ imageSrc, imageAlt, buttonText, link }) {
  return (
    <div className={styles.cardWrapper}>
      <div className={styles.card}>
        <img 
          loading="lazy"
          src={imageSrc}
          alt={imageAlt}
          className={styles.cardImage}
        />
      </div>
      <Link to={link} className={styles.cardButtonLink}>
        <button className={styles.cardButton} type="button">
          {buttonText}
        </button>
      </Link>
    </div>
  );
}