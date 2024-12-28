import React, { useState } from 'react';
import styles from './Popup.module.css';

function UpdateAppointment() {
  const [showFirstPopup, setShowFirstPopup] = useState(true); // State for the first popup
  const [showSecondPopup, setShowSecondPopup] = useState(false); // State for the second popup

  const handleSave = (e) => {
    e.preventDefault(); // Prevent default form submission
    setShowFirstPopup(false); // Close the first popup
    setShowSecondPopup(true); // Show the second popup
  };

  const closeFirstPopup = () => {
    setShowFirstPopup(false); // Close the first popup
    window.location.reload();
  };

  const closeBothPopups = () => {
    setShowFirstPopup(false); // Close the first popup
    setShowSecondPopup(false); // Close the second popup
    // window.location.reload();
  };

  return (
    <div>
      {/* First Modal with Blood Type and Blood Packet Form */}
      {showFirstPopup && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
          <div className={styles.popupTitle}>Jom Derma Darah 2024</div>
          <form className={styles.formContainer}>
              <label className={styles.formLabel}>Event Date</label>
              <input 
                type="text" 
                className={styles.input}
                value="24/12/2024"
                readOnly
              ></input>

              <label className={styles.formLabel}>Event Location</label>
              <input
                type="text"
                className={styles.input}
                value="Dewan Utama Pelajar"
                readOnly
              ></input>

              <label className={styles.formLabel}>Donor Name</label>
              <input
                type="text"
                value="John Doe"
                className={styles.input}
                readOnly
              ></input>

              <div className={styles.rowContainer}>
                <div className={styles.column}>
                  <label className={styles.formLabel}>Time Slot</label>
                  <input
                    type="text"
                    value="9.30AM - 10.00AM"
                    className={styles.input}
                    readOnly
                  />
                </div>

                <div className={styles.column}>
                  <label className={styles.formLabel}>Status</label>
                  <select className={styles.input}>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                    <option value="NoShow">No Show</option>
                  </select>
                </div>
              </div>

              <div className={styles.buttonGroup}>
                
                <button
                  type="button"
                  className={styles.closeButton}
                  onClick={() => closeFirstPopup(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.submitButton}
                  onClick={handleSave}
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Second Modal (after Save is clicked) */}
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
            Appoinment has been updated successfully!
              <br />
              <br />
            </p>
            <div className={styles.buttonContainer}>
              <button
              type="button"
              className={styles.button}
              onClick={() => {
                closeBothPopups();
              }}
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

export default UpdateAppointment;
