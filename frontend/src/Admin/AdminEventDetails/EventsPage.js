import React from 'react';
import EventTable from './EventTable';
import styles from './EventsPage.module.css';

const EventsPage = () => {
  const events = [
    {
      id: 1,
      name: 'Jom Derma Darah 2024',
      date: '25/12/2024',
      location: 'Dewan Utama Pelajar',
      startTime: '08:00 AM',
      endTime: '05:00 PM',
      status: 'Ongoing'
    }
  ];

  return (
    <div className={styles.background}>
      <div className={styles.content}>
        <h1 className={styles.title}>Event Details</h1>
        <EventTable events={events} />
      </div>
    </div>
  );
};

export default EventsPage;