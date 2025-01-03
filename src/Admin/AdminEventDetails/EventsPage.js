import React from 'react';
import EventTable from './EventTable';
import styles from './EventsPage.module.css';

const EventsPage = () => {
  const events = [{}];

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