import React, { useEffect, useState } from 'react';
import AppointmentCardMS from './AppointmentCardMS';
import styles from './AppointmentViewMS.module.css';

export const AppointmentViewMS = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8081/admin-event')
      .then(response => response.json())
      .then(data => {
        console.log('Fetched appointments:', data); // Add this line
        setAppointments(data.events);
      })
      .catch(error => console.error('Error fetching appointments:', error));
  }, []);

  return (
    <div className={styles.mainContainer}>
      <main className={styles.mainContent}>
        <h1 className={styles.pageTitle}>Upcoming Appointments</h1>
        <section className={styles.appointmentGrid}>
          {appointments.map((appointment, index) => (
            <AppointmentCardMS key={index} {...appointment} />
          ))}
        </section>
      </main>
    </div>
  );
};