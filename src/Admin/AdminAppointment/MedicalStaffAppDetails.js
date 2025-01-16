import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import AppointmentTable from './AppointmentTable';
import styles from './MedicalStaffAppDetails.module.css';

export default function MedicalStaffAppDetails() {
  const location = useLocation();
  const eventTitle = location.state?.eventTitle || "Default Event Title"; // Retrieve eventTitle from state
  const { name, eventID } = location.state || {
    name: "Default Name",
    eventID: null,
    staffID: null
  };

  console.log('MedicalStaffAppDetails:', { eventID, eventTitle });
  
  return (
    <main className={styles.pageContainer}>
      <section className={styles.eventContainer}>
        <h1 className={styles.eventTitle}>
          <Link to="/admin-appointment" className={styles.link}>
            {eventTitle}
          </Link>
          {' > '}
          <span className={styles.staffName}>{name}</span> {/* Display the name without linking */}
        </h1>
        <AppointmentTable />
      </section>
    </main>
  );
}