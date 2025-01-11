import React from 'react';
import { Link } from 'react-router-dom';
import styles from './ConfirmationModal.module.css';

function ConfirmationModal() {
  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popupContent}>
        <img
          src="/CheckMark.png"
          className={styles.successIcon}
          alt="Success checkmark"
        />
        <h3 className={styles.popupTitle}>Appointment Confirmed!</h3>
        <p className={styles.popupMessage}>
        Your appointment has been successfully scheduled. Please be sure to attend at the specified time and date.
        </p>
        <Link to='/appointment-view'>
        <button className={styles.closeButton}>
          Close
        </button></Link>
        </div>
      </div>
  );
}

export default ConfirmationModal;
