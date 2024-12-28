import React from 'react';
import styles from './AppointmentList.module.css';
import { AppointmentCard } from './AppointmentCard';

export function AppointmentList() {
  const appointments = [
    { id: 1, title: 'Jom Derma Darah 2024' },
    { id: 2, title: 'Jom Derma Darah 2025' },
    { id: 3, title: 'Jom Derma Darah 2026' },
    { id: 4, title: 'Jom Derma Darah 2027' },
    { id: 5, title: 'Jom Derma Darah 2028' },
  ];

  return (
    <div className={styles.appointmentsContainer}>
      <main className={styles.mainContent}>
        <h2 className={styles.pageTitle}>Appointments</h2>
        <section className={styles.appointmentsList}>
          {appointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              id={appointment.id}
              title={appointment.title}
            />
          ))}
        </section>
      </main>
    </div>
  );
}
