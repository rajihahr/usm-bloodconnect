import React from 'react';
import styles from './AppointmentView.module.css'; // use css same as AppointmentView
import AppointmentCardHistory from './AppointmentCardHistory';
import ButtonGroup from './ButtonGroup';

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

function AppointmentHistory() {
  return (
    <div className={styles.appointmentViewContainer}>
      <main className={styles.mainContent}>
        <ButtonGroup />
        <section className={styles.appointmentGrid}>
          {appointmentData.map((appointment, index) => (
            <AppointmentCardHistory key={index} {...appointment} />
          ))}
        </section>
      </main>
    </div>
  );
}

export default AppointmentHistory;