import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './AppointmentStatus.module.css';

function AppointmentStatus() {
  const [bloodType, setBloodType] = useState('');
  const [bloodPacket, setBloodPacket] = useState('');
  const [showFirstPopup, setShowFirstPopup] = useState(true); // State for the first popup
  const [showSecondPopup, setShowSecondPopup] = useState(false); // State for the second popup

  const isSaveButtonDisabled = !bloodType || !bloodPacket;

  const handleSave = (e) => {
    e.preventDefault(); // Prevent default form submission
    setShowFirstPopup(false); // Close the first popup
    setShowSecondPopup(true); // Show the second popup
  };

  const closeBothPopups = () => {
    setShowFirstPopup(false); // Close the first popup
    setShowSecondPopup(false); // Close the second popup
    window.location.reload();
  };

  return (
    <div>
      {/* First Modal with Blood Type and Blood Packet Form */}
      {showFirstPopup && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalDonorForm}>
            <form className={styles.statusForm} onSubmit={handleSave}>
              <div className={styles.formGroup}>
                <h3 className={styles.titleDonorForm}>Donor Appointment Status</h3>
                <label htmlFor="donorName" className={styles.label}>Donor Name</label>
                <input
                  type="text"
                  id="donorName"
                  className={styles.input}
                  value="John Doe"
                  readOnly
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="bloodType" className={styles.label}>Blood Type</label>
                <select
                  id="bloodType"
                  className={styles.select}
                  aria-label="Select blood type"
                  value={bloodType}
                  onChange={(e) => setBloodType(e.target.value)}
                >
                  <option value="">- Select -</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="bloodPacket" className={styles.label}>Blood Packet</label>
                <input
                  type="number"
                  id="bloodPacket"
                  className={styles.input}
                  placeholder="Quantity"
                  aria-label="Blood packet quantity"
                  value={bloodPacket}
                  min="0"
                  onChange={(e) => setBloodPacket(e.target.value)}
                />
              </div>
              <div className={styles.buttonContainer1}>
                
                <Link to='/donor-details' onClick={closeBothPopups} className={styles.linkButton}>
                <button
                  className={styles.close1Button}
                  tabIndex={0}
                >
                  Cancel
                </button></Link>
                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={isSaveButtonDisabled}
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
          <span className={styles.statusMessageBold}>COMPLETED.</span>
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

export default AppointmentStatus;
