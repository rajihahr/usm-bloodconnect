import React from 'react';
import styles from './CancellationPopup.module.css';

function CancellationPopup({ onClose, onConfirm, appointment }) {
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
          <button className={styles.closeButton} onClick={onClose}>
            Close
          </button>
          <button
            className={styles.bookButton}
            onClick={() => onConfirm(appointment)}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default CancellationPopup;