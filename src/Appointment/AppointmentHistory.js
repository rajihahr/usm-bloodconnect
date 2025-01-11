import React, { useState, useEffect } from 'react';
import AppointmentCardHistory from './AppointmentCardHistory';
import ButtonGroup from './ButtonGroup';
import styles from './AppointmentView.module.css';

function AppointmentHistory({ user }) {
  const [appointments, setAppointments] = useState([]);
  const donorID = user?.id;

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(`http://localhost:8081/api/appointments/${donorID}`);
        const data = await response.json();
        console.log("Fetched appointment data:", data);
        const filteredAppointments = data.filter(appointment => appointment.status === 'Completed');
        setAppointments(filteredAppointments);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    if (donorID) {
      fetchAppointments();
    }
  }, [donorID]);

  return (
    <div className={styles.appointmentViewContainer}>
      <main className={styles.mainContent}>
        <ButtonGroup />
        <section className={styles.appointmentGrid}>
          {appointments.map((appointment, index) => (
            <AppointmentCardHistory key={index} {...appointment} />
          ))}
        </section>
      </main>
    </div>
  );
}

export default AppointmentHistory;