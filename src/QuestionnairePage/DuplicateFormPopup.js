import React from 'react';
import styles from './IncompleteFormPopup.module.css';

function DuplicateFormPopup({ onClose }) {
  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popupContent}>
        <h3 className={styles.popupTitle}>Oops!</h3>
        <p className={styles.popupMessage}>
            You cannot fill out the questionnaire more than once for the same event.
        </p>
        <button className={styles.closeButton} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default DuplicateFormPopup;