import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './AppointmentStatus.module.css';

function AppointmentStatus({ appointment, onClose }) {
  const [bloodTypes, setBloodTypes] = useState([]);
  const [selectedBloodType, setSelectedBloodType] = useState('');
  const [bloodPacket, setBloodPacket] = useState('');
  const [showFirstPopup, setShowFirstPopup] = useState(true);
  const [showSecondPopup, setShowSecondPopup] = useState(false);

  // Fetch blood types from database when component mounts
  useEffect(() => {
    fetch('http://localhost:8081/blood-types')
      .then(response => response.json())
      .then(data => {
        setBloodTypes(data);
      })
      .catch(error => console.error('Error fetching blood types:', error));
  }, []);

  const isSaveButtonDisabled = !selectedBloodType || !bloodPacket;

  const handleSave = async (e) => {
    e.preventDefault();
    
    console.log('Saving appointment with data:', {
      donorID: appointment.donorID,
      bloodType: selectedBloodType,
      appointmentID: appointment.id,
      bloodPacket
    });
  
    try {
      // Update donor blood type
      const donorResponse = await fetch('http://localhost:8081/update-donor-blood', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          donorID: appointment.donorID,
          bloodType: selectedBloodType
        }),
      });
  
      const donorData = await donorResponse.json();
      console.log('Donor blood type update response:', donorData);
  
      if (!donorResponse.ok) {
        throw new Error('Failed to update donor blood type');
      }
  
      // Update appointment status
      const appointmentResponse = await fetch('http://localhost:8081/update-appointment-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          appointmentID: appointment.id,
          status: 'Completed'
        }),
      });
  
      if (!appointmentResponse.ok) {
        throw new Error('Failed to update appointment status');
      }
  
      // Update blood bank quantity
      const bloodResponse = await fetch('http://localhost:8081/update-blood-quantity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bloodID: selectedBloodType,
          quantity: parseInt(bloodPacket)
        }),
      });
  
      if (!bloodResponse.ok) {
        throw new Error('Failed to update blood quantity');
      }
  
      setShowFirstPopup(false);
      setShowSecondPopup(true);
    } catch (error) {
      console.error('Error updating data:', error);
      alert(`An error occurred while saving the data: ${error.message}`);
    }
  };

  const closeBothPopups = () => {
    setShowFirstPopup(false);
    setShowSecondPopup(false);
    onClose();
    window.location.reload();
  };

  return (
    <div>
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
                  value={appointment.name}
                  readOnly
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="bloodType" className={styles.label}>Blood Type</label>
                <select
                  id="bloodType"
                  className={styles.select}
                  value={selectedBloodType}
                  onChange={(e) => setSelectedBloodType(e.target.value)}
                >
                  <option value="">- Select -</option>
                  {bloodTypes.map(type => (
                    <option key={type.bloodID} value={type.bloodID}>
                      {type.bloodType}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="bloodPacket" className={styles.label}>Blood Packet</label>
                <input
                  type="number"
                  id="bloodPacket"
                  className={styles.input}
                  placeholder="Quantity"
                  value={bloodPacket}
                  min="0"
                  onChange={(e) => setBloodPacket(e.target.value)}
                />
              </div>
              <div className={styles.buttonContainer1}>
                <button
                  type="button"
                  className={styles.close1Button}
                  onClick={closeBothPopups}
                >
                  Cancel
                </button>
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
            <button
              className={styles.closeButton}
              onClick={closeBothPopups}
              tabIndex={0}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AppointmentStatus;