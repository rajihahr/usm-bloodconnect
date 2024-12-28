import React from 'react';
import styles from './Popup.module.css';

function Popup({ onClose, onConfirm, title, message }) {
  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popupContent}>
      <img
          src="/Cancel.png"
          className={styles.successIcon}
          alt="Success checkmark"
        />
        <h3 className={styles.popupTitle}>{title}</h3>
        <p className={styles.popupMessage}>{message}</p>
        <div className={styles.buttonContainer}>
          <button className={styles.closeButton} onClick={onClose}>
            Cancel
          </button>
          <button className={styles.bookButton} onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default Popup;
