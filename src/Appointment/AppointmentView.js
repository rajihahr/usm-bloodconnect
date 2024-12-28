import React, { useState } from 'react';
import AppointmentCard from './AppointmentCard';
import ButtonGroup from './ButtonGroup';
import CancellationPopup from './CancellationPopup';
import styles from './AppointmentView.module.css';

const appointmentData = [
  {
    title: "Jom Derma Darah 2024",
    location: "Dewan Utama Pelajar, USM",
    date: "25th December 2024",
    doctor: "Dr. Syaza Sufia",
    time: "8.00 AM - 5.00 PM"
  },
  {
    title: "Jom Derma Darah 2024",
    location: "Dewan Utama Pelajar, USM",
    date: "25th December 2024",
    doctor: "Dr. Syaza Sufia",
    time: "8.00 AM - 5.00 PM"
  },
  {
    title: "Jom Derma Darah 2024",
    location: "Dewan Utama Pelajar, USM",
    date: "25th December 2024",
    doctor: "Dr. Syaza Sufia",
    time: "8.00 AM - 5.00 PM"
  },
  {
    title: "Jom Derma Darah 2024",
    location: "Dewan Utama Pelajar, USM",
    date: "25th December 2024",
    doctor: "Dr. Syaza Sufia",
    time: "8.00 AM - 5.00 PM"
  },
  {
    title: "Jom Derma Darah 2024",
    location: "Dewan Utama Pelajar, USM",
    date: "25th December 2024",
    doctor: "Dr. Syaza Sufia",
    time: "8.00 AM - 5.00 PM"
  },
  {
    title: "Jom Derma Darah 2024",
    location: "Dewan Utama Pelajar, USM",
    date: "25th December 2024",
    doctor: "Dr. Syaza Sufia",
    time: "8.00 AM - 5.00 PM"
  },
  {
    title: "Jom Derma Darah 2024",
    location: "Dewan Utama Pelajar, USM",
    date: "25th December 2024",
    doctor: "Dr. Syaza Sufia",
    time: "8.00 AM - 5.00 PM"
  },
  {
    title: "Jom Derma Darah 2024",
    location: "Dewan Utama Pelajar, USM",
    date: "25th December 2024",
    doctor: "Dr. Syaza Sufia",
    time: "8.00 AM - 5.00 PM"
  },  
];

function AppointmentView() {
  const [showCancellationPopup, setShowCancellationPopup] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const handleCancelClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowCancellationPopup(true);
  };

  return (
    <div className={styles.appointmentViewContainer}>
      <main className={styles.mainContent}>
        <ButtonGroup />
        <section className={styles.appointmentGrid}>
          {appointmentData.map((appointment, index) => (
            <AppointmentCard
            key={index}
            {...appointment}
            onCancel={() => handleCancelClick(appointment)} // Passing down the cancel handler
            />
          ))}
        </section>
      </main>

      {showCancellationPopup && (
        <CancellationPopup
          onClose={() => setShowCancellationPopup(false)}
          onConfirm={() => {
            // Handle confirmation logic (like actually canceling the appointment)
            setShowCancellationPopup(false);
          }}
          appointment={selectedAppointment} // Pass the selected appointment to the popup if needed
        />
      )}
    </div>
  );
}

export default AppointmentView;