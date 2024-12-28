import React from 'react';
import { useLocation } from 'react-router-dom';
import styles from './AppointmentList.module.css';
import { AppointmentCardMedicalStaff } from './AppointmentCardMedicalStaff';

export function AppointmentListMedicalStaff() {
  const location = useLocation();
  const eventTitle = location.state?.title || "No Title Provided"; // Retrieve title from state

  const appointments = [
    { id: 1, name: 'Dr. Syaza Sufia Binti Roselan' },
    { id: 2, name: 'Dr. Maisarah Qistina Binti Meor Sha\'azizi' },
    { id: 3, name: 'Dr. Rajihah Binti Mohd Rosydi' },
    { id: 4, name: 'Dr. Najwa Batrisyia Binti Mohamad' },
    { id: 5, name: 'Dr. Marsya Diyana Binti Meor Sha\'azizi' }
  ];

  const handleView = (id) => {
    console.log(`Viewing appointment ${id}`);
  };

  return (
    <div className={styles.appointmentsContainer}>
      <main className={styles.mainContent}>
        <h2 className={styles.pageTitle}>{eventTitle}</h2>
        <section className={styles.appointmentsList}>
          {appointments.map((appointment) => (
            <AppointmentCardMedicalStaff
              key={appointment.id}
              name={appointment.name}
              eventTitle={eventTitle} // Pass eventTitle as a prop
              onView={() => handleView(appointment.id)}
            />
          ))}
        </section>
      </main>
    </div>
  );
}
