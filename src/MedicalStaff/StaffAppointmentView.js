import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AppointmentTable from './AppointmentTable';
import styles from './AppointmentDonor.module.css';

export function StaffAppointmentView({ user }) {
  const { eventID } = useParams();
  const [eventDetails, setEventDetails] = useState(null);

  // Rest of your code remains the same
  function formatDateOnly(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${day} / ${month} / ${year}`;
  }

  function formatTimeOnly(timeString) {
    return timeString.slice(0, 5);
  }

  useEffect(() => {
      if (eventID) {
        fetch(`http://localhost:8081/events-appointment-view/${eventID}`) // Assuming you have an endpoint like this
          .then(response => response.json())
          .then(data => {
            console.log("Event details:", data);
            setEventDetails(data.event); // Set event data in state
          })
          .catch(err => console.error("Error fetching event:", err));
      }
    }, [eventID]);

    return (
      <main className={styles.pageContainer}>
        <section className={styles.eventContainer}>
          {eventDetails ? (
            <>
              <h1 className={styles.eventTitle}>{eventDetails.eventName}</h1>
              <p className={styles.eventDetails}>
                Date: {formatDateOnly(eventDetails.eventDate)}
                <br />
                Time: {formatTimeOnly(eventDetails.startTime)} - {formatTimeOnly(eventDetails.endTime)}
                <br />
                Venue: {eventDetails.eventLocation}
              </p>
            </>
          ) : (
            <p>Loading event details...</p>
          )}
        </section>
      <AppointmentTable user={user} eventID={eventID} />
      </main>
  );
}

export default StaffAppointmentView;