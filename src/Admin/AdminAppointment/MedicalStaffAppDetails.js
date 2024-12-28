import React from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation
// import { Link } from 'react-router-dom';
import AppointmentTable from './AppointmentTable';
import styles from './MedicalStaffAppDetails.module.css';

export default function MedicalStaffAppDetails() {
  const location = useLocation();
  const { title, name } = location.state || { title: "Default Title", name: "Default Name" };

  return (
    <main className={styles.pageContainer}>
      <section className={styles.eventContainer}>
        <h1 className={styles.eventTitle}>{`${title} > ${name}`}</h1>
      <AppointmentTable />
      </section>
    </main>
  );
}
