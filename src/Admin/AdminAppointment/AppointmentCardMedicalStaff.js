import React from 'react';
import { Link } from 'react-router-dom';
import styles from './AppointmentCard.module.css';

export function AppointmentCardMedicalStaff({ name, onView, eventTitle, staffID, eventID }) {
  return (
    <article className={styles.appointmentCard}>
      <h3 className={styles.eventTitle}>{name}</h3>
      <Link
        to="/medicalstaff-app-details"
        state={{ staffID, eventID, eventTitle, name }} // Pass the necessary state
      >
        <button
          className={styles.viewButton}
          onClick={onView}
          aria-label={`View details for ${name}`}
        >
          View
        </button>
      </Link>
    </article>
  );
}