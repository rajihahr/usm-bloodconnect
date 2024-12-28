import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './AppointmentStatus.module.css';

function AppointmentNoShow() {
  const [showFirstPopup, setShowFirstPopup] = useState(true); // State for showing the first popup
  const [showSecondPopup, setShowSecondPopup] = useState(false); // State for showing the second popup

  // Click the confirm button click on the first popup
  const handleConfirmClick = () => {
    setShowFirstPopup(false); // Close the first popup
    setShowSecondPopup(true); // Show the second popup
  };

  // Click the cancel button click on the first popup 
  const handleCancelClick = () => {
    setShowFirstPopup(false); // Close the first popup
    window.location.reload();
  };

  // Close both popups (first and second) and redirect
  const closeBothPopups = () => {
    setShowFirstPopup(false); // Close the first popup
    setShowSecondPopup(false); // Close the second popup
    window.location.reload();
  };

  return (
    <div>
      {/* First Modal with Cancel and Confirm Buttons */}
      {showFirstPopup && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
          <img
          src="/Cancel.png"
          className={styles.statusIcon}
          alt="Success checkmark"
        />
          <h3 className={styles.popupTitle}>Confirm Status?</h3>
            <p className={styles.statusMessage}>
                Are you sure you want to confirm the status as 'No Show'? This action cannot be undone.
              <br />
              <br />
            </p>
            <div className={styles.buttonContainer}>
              <button
                className={styles.cancelButton}
                onClick={handleCancelClick} // Close the first popup
                tabIndex={0}
              >
                Cancel
              </button>

              <button
                className={styles.confirmButton}
                onClick={handleConfirmClick} // Show the second popup
                tabIndex={0}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Second Modal (appears after clicking Confirm on the first modal) */}
      {showSecondPopup && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <img
              loading="lazy"
              src="/CheckMark.png"
              className={styles.statusIcon}
              alt="Appointment status update confirmation icon"
            />
            <p className={styles.statusMessage}>
              The donor's appointment status has been updated to
              <br />
              <br />
              <span className={styles.statusMessageBold}>NO SHOW.</span>
              <br />
              <br />
            </p>
              {/* Use the closeBothPopups to hide both popups and then redirect */}
              <Link to="/donor-details" onClick={closeBothPopups} className={styles.linkButton}>
                <button
                  className={styles.closeButton}
                  tabIndex={0}
                >
                  Close 
                </button>
              </Link>
            </div>
          </div>
      )}
    </div>
  );
}

export default AppointmentNoShow;