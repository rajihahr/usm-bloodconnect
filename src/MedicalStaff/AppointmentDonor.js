import React from 'react';
import AppointmentTable from './AppointmentTable';
import styles from './AppointmentDonor.module.css';

export default function DonationPage() {
  return (
    <main className={styles.pageContainer}>
      <section className={styles.eventContainer}>
        <h1 className={styles.eventTitle}>Jom Derma Darah 2024</h1>
        <p className={styles.eventDetails}>
          Date: 25th December 2024
          <br />
          Time: 8.00 AM - 5.00 PM
          <br />
          Venue: Dewan Utama Pelajar, USM
        </p>
      </section>

      <AppointmentTable />
    </main>
  );
}
