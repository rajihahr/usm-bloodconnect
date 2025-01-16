import React, { useEffect, useState } from 'react';
import AppointmentCardMS from './AppointmentCardMS';
import styles from './AppointmentViewMS.module.css';

export const AppointmentViewMS = ({ user }) => {
  const [appointments, setAppointments] = useState([]);
  const staffID = user?.id;

  useEffect(() => {
    if (!staffID) return;

    fetch(`http://localhost:8081/staff-appointments/${staffID}`)
      .then(response => response.json())
      .then(data => {
        console.log('Fetched appointments:', data);
        setAppointments(data.events || []);
      })
      .catch(error => console.error('Error fetching appointments:', error));
  }, [staffID]);

  return (
    <div className={styles.mainContainer}>
      <main className={styles.mainContent}>
        <h1 className={styles.pageTitle}>Upcoming Appointments</h1>
        <section className={styles.appointmentGrid}>
          {appointments.length > 0 ? (
            appointments.map((appointment, index) => (
              <AppointmentCardMS key={index} {...appointment} />
            ))
          ) : (
            <p>No appointments found for this staff member.</p>
          )}
        </section>
      </main>
    </div>
  );
};