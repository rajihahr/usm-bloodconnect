import React from 'react';
import { Link } from 'react-router-dom';
import styles from './AppointmentCard.module.css';

export function AppointmentCard({ id, title, onView }) {
  return (
    <article className={styles.appointmentCard}>
      <h3 className={styles.eventTitle}>{title}</h3>
      <Link
        to="/admin-appointment-medicalstaff"
        state={{ title, eventID: id }} // Pass the eventID and title
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