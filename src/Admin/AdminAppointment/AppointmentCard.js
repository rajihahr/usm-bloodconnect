import React from 'react';
import { Link } from 'react-router-dom';
import styles from './AppointmentCard.module.css';

export function AppointmentCard({ title, onView }) {
  return (
    <article className={styles.appointmentCard}>
      <h3 className={styles.eventTitle}>{title}</h3>
      <Link
        to="/admin-appointment-medicalstaff"
        state={{ title }} // Pass the event title as state here
      >
        <button
          className={styles.viewButton}
          onClick={onView}
          aria-label={`View details for ${title}`}
        >
          View
        </button>
      </Link>
    </article>
  );
}
