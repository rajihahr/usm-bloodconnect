import React, { useState } from 'react';
import styles from './BookAppointment.module.css';
import DoctorCard from './DoctorCard';
import ConfirmationModal from './ConfirmationModal';

const doctors = [
  { name: 'Dr. Syaza Sufia Binti Roselan' },
  { name: 'Dr. Najwa Batrisyia Binti Mohamad' },
  { name: 'Dr. Maisarah Qistina Binti Meor Sha\'azizi' },
  { name: 'Dr. Rajihah Binti Rosydi' },
  { name: 'Dr. Anis Farihah Binti Mohd Fuad' },
  { name: 'Dr. Marsya Diyana Binti Meor Sha\'azizi' }
];

function BookAppointment() {
  const [selectedDoctor, setSelectedDoctor] = useState(null); // Track selected doctor
  const [timeslotSelected, setTimeslotSelected] = useState(false); // Track if any time slot is selected
  const [isModalOpen, setIsModalOpen] = useState(false); // Track modal visibility

  const handleTimeslotSelection = (doctorName, timeslot) => {
    if (timeslot) {
      setSelectedDoctor(doctorName);
      setTimeslotSelected(true);
    } else {
      setSelectedDoctor(null);
      setTimeslotSelected(false);
    }
  };

  const handleConfirmBooking = () => {
    if (timeslotSelected) {
      setIsModalOpen(true); // Open modal on confirm
    }
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close modal
  };

  return (
    <div className={styles.bookAppointment}>
      <main className={styles.content}>
        <section className={styles.eventInfo}>
          <h1 className={styles.eventTitle}>Jom Derma Darah 2024 — Book your appointment now!</h1>
          <p className={styles.eventDetails}>
            Date: 25th December 2024<br />
            Time: 8.00 AM - 5.00 PM<br />
            Venue: Dewan Utama Pelajar, USM
          </p>
        </section>
        <div className={styles.doctorGrid}>
          {doctors.map((doctor, index) => (
            <DoctorCard 
              key={index} 
              name={doctor.name} 
              isDisabled={timeslotSelected && selectedDoctor !== doctor.name}
              onTimeslotSelect={handleTimeslotSelection}
            />
          ))}
        </div>
      </main>
      <footer className={styles.actions}>
        <button 
          className={`${styles.confirmButton} ${!timeslotSelected ? styles.disabled : ''}`} 
          disabled={!timeslotSelected}
          onClick={handleConfirmBooking}
        >
          Confirm
        </button>
      </footer>

      {/* Render the modal only when isModalOpen is true */}
      {isModalOpen && <ConfirmationModal onClose={closeModal} />}
    </div>
  );
}

export default BookAppointment;
