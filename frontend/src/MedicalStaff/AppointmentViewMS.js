import React from 'react'; 
import AppointmentCardMD from './AppointmentCardMS';
import styles from './AppointmentViewMS.module.css';

const appointmentData = [
  {
    title: "Jom Derma Darah 2024",
    location: "Dewan Utama Pelajar, USM",
    date: "25th December 2024",
    doctor: "Dr. Syaza Sufia",
    time: "8.00 AM - 5.00 PM",
    buttonText: "est"
  },
  {
    title: "Jom Derma Darah 2024",
    location: "Dewan Utama Pelajar, USM",
    date: "25th December 2024",
    doctor: "Dr. Syaza Sufia",
    time: "8.00 AM - 5.00 PM",
    buttonText: "view"
  },
  {
    title: "Jom Derma Darah 2024",
    location: "Dewan Utama Pelajar, USM",
    date: "25th December 2024",
    doctor: "Dr. Syaza Sufia",
    time: "8.00 AM - 5.00 PM",
    buttonText: "Cancel"
  },
  {
    title: "Jom Derma Darah 2024",
    location: "Dewan Utama Pelajar, USM",
    date: "25th December 2024",
    doctor: "Dr. Syaza Sufia",
    time: "8.00 AM - 5.00 PM",
    buttonText: "est"
  }
];

export const AppointmentViewMS = () => {
  return (
    <div className={styles.mainContainer}> 
      <main className={styles.mainContent}>
        <h1 className={styles.pageTitle}>Upcoming Appointments</h1>
        <section className={styles.appointmentGrid}>
          {appointmentData.map((appointment, index) => (
            <AppointmentCardMD key={index} {...appointment} />
          ))}
        </section>
      </main>
    </div>
  );
};
