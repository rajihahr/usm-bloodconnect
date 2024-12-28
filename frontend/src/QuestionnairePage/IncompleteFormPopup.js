import React from 'react';
import styles from './IncompleteFormPopup.module.css';

function IncompleteFormPopup({ onClose }) {
  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popupContent}>
        <h3 className={styles.popupTitle}>Oops!</h3>
        <p className={styles.popupMessage}>
          You need to answer all the questions before submitting.
        </p>
        <button className={styles.closeButton} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default IncompleteFormPopup;