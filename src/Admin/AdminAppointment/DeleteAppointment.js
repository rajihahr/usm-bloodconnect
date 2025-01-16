import React, { useState } from 'react';
import styles from './Popup.module.css';

function DeleteAppointment({ onClose, appointment, onDelete }) {
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
    onClose();
  };

  // Close both popups (first and second) and delete appointment
  const handleDelete = () => {
    onDelete(appointment.appointmentID);
    setShowSecondPopup(false); // Close the second popup
  };

  return (
    <div>
      {/* First Modal with Cancel and Confirm Buttons */}
      {showFirstPopup && (
        <div className={styles.modalOverlay}>
          <div className={styles.popupContent}>
          <img
          src="/Cancel.png"
          className={styles.successIcon}
          alt="Success checkmark"
        />
        <h3 className={styles.popupTitle}>Confirm delete?</h3>
            <p className={styles.popupMessage}>
                Are you sure you want to confirm this action? This cannot be undone.
              <br />
              <br />
            </p>
            <div className={styles.buttonContainer}>
              <button
                className={styles.cancel1Button}
                onClick={handleCancelClick} // Close the first popup
                tabIndex={0}
              >
                Cancel
              </button>
              <button
                className={styles.button}
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
          <div className={styles.container}>
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/bad211839433f3469f983b36cea176bda5a4796eeccf29e491904a9db68b941d?placeholderIfAbsent=true&apiKey=dc1dfaeed34d4c05a46eb3603635944e"
              className={styles.statusIcon}
              alt="Appointment status update confirmation icon"
            />
            <p className={styles.statusMessage}>
            Appointment has been deleted successfully!
              <br />
              <br />
            </p>
            <div className={styles.buttonContainer}>
              {/* Use handleDelete to delete the appointment */}
              <button
                className={styles.button}
                tabIndex={0}
                onClick={handleDelete}
              >
                Close 
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DeleteAppointment;