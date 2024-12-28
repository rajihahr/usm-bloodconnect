import React from 'react';
import styles from './BloodTypeCard.module.css';

export const BloodTypeCard = ({ type, quantity, iconSrc }) => {
  return (
    <div className={styles.bloodTypeCard}>
      <div className={styles.typeLabel}>{type}</div>
      <div className={styles.quantitySection}>
        <div className={styles.quantityWrapper}>
          <img 
            src={iconSrc} 
            alt="" 
            className={styles.quantityIcon} 
            loading="lazy"
          />
          <span className={styles.quantityValue}>{quantity}</span>
        </div>
      </div>
    </div>
  );
};