import React, { useState } from "react";
import styles from "./AppointmentStatus.module.css";

function AppointmentNoShow({ appointment, onClose, onDeleteSuccess }) {
  const [showFirstPopup, setShowFirstPopup] = useState(true); // State for showing the first popup
  const [showSecondPopup, setShowSecondPopup] = useState(false); // State for showing the second popup
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirmClick = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(
        `http://localhost:8081/appointments/${appointment.id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setShowFirstPopup(false);
        setShowSecondPopup(true);
        onDeleteSuccess(appointment.id);
      } else {
        const errorData = await response.json();
        console.error("Failed to delete appointment:", errorData);
        alert(errorData.error || "Error: Could not delete the appointment.");
      }
    } catch (error) {
      console.error("Error deleting appointment:", error);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelClick = () => {
    setShowFirstPopup(false); // Close the first popup
    onClose(); // Close modal
  };

  return (
    <div>
      {showFirstPopup && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <img
              src="/Cancel.png"
              className={styles.statusIcon}
              alt="Cancel icon"
            />
            <h3 className={styles.popupTitle}>Confirm Status?</h3>
            <p className={styles.statusMessage}>
              Are you sure you want to change the status to <b>No Show</b>? This
              action cannot be undone.
            </p>
            <div className={styles.buttonContainer}>
              <button
                className={styles.cancelButton}
                onClick={handleCancelClick}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                className={styles.confirmButton}
                onClick={handleConfirmClick}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
      {showSecondPopup && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <img
              src="/CheckMark.png"
              className={styles.statusIcon}
              alt="Success icon"
            />
            <p className={styles.statusMessage}>
              The donor's appointment status has been updated to <b>No Show</b>.
            </p>
            <button className={styles.closeButton} onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AppointmentNoShow;