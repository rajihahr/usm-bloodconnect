import React from 'react';
import { useParams } from 'react-router-dom';
import AppointmentTable from './AppointmentTable';
import styles from './StaffAppointmentView.module.css';

export function StaffAppointmentView({ user }) {
  const { eventID } = useParams();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Appointments for Event</h1>
      <AppointmentTable user={user} eventID={eventID} />
    </div>
  );
}

export default StaffAppointmentView;