import React from 'react';
import styles from './Popup.module.css';
import { Link } from 'react-router-dom';

export function Popup() {
  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popupContent}>
        <img
          src="/CheckMark.png"
          className={styles.successIcon}
          alt="Success checkmark"
        />
        <h3 className={styles.popupTitle}>Thank you for your feedback!</h3>
        <p className={styles.popupMessage}>
        Your input is valuable in helping us improve our system.
        </p>
        <Link to='/'>
        <button className={styles.closeButton}>
          Home
        </button></Link>
        </div>
      </div>
  );
}