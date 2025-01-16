import React, { useState, useEffect } from 'react';
import styles from './AppointmentList.module.css';
import { AppointmentCard } from './AppointmentCard';

export function AppointmentList() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:8081/admin-event");
        const data = await response.json();
        
        if (data.events) {
          setEvents(data.events);
        } else {
          console.error("Error fetching events:", data.message);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className={styles.appointmentsContainer}>
      <main className={styles.mainContent}>
        <h2 className={styles.pageTitle}>Appointments</h2>
        <section className={styles.appointmentsList}>
          {events.map((appointment) => (
            <AppointmentCard
              key={appointment.eventID}
              id={appointment.eventID}
              title={appointment.eventName} // Assuming the event title is stored in `eventTitle`
            />
          ))}
        </section>
      </main>
    </div>
  );
}