import React from 'react';
import styles from './CancellationPopup.module.css';
import { Link } from 'react-router-dom';

function CancellationPopup({ onClose }) {
  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popupContent}>
      <img
          src="/Cancel.png"
          className={styles.successIcon}
          alt="Success checkmark"
        />
        <h3 className={styles.popupTitle}>Cancel Appointment?</h3>
        <p className={styles.popupMessage}>
          Are you sure you want to cancel the appointment? This action cannot be undone.
        </p>
        <div className={styles.buttonContainer}>
        <Link to="/appointment-view" onClick={onClose}>
          <button className={styles.closeButton}>
            Close
          </button></Link>
          <Link to="/appointment-view" onClick={onClose}>
          <button className={styles.bookButton}>
            Confirm
          </button></Link>
        </div>
      </div>
    </div>
  );
}

export default CancellationPopup;

