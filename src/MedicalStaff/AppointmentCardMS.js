import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AppointmentCardMS.module.css';

function formatDate(isoDate) {
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function formatTime(timeString) {
  const [hours, minutes] = timeString.split(':');
  const date = new Date();
  date.setHours(hours, minutes);
  return date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

function AppointmentCardMS({ eventID, eventName, eventLocation, eventDate, startTime, endTime }) {
  const navigate = useNavigate(); // Initialize the navigate hook

  const handleNavigate = () => {
    // Correctly use navigate with the eventID passed as state
    navigate('/donor-details', { state: { eventID } });
  };

  return (
    <article className={styles.appointmentCard}>
      <h2 className={styles.title}>{eventName}</h2>
      <div className={styles.details}>
        <div className={styles.detailItem}>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/e33f456ad328b9413bdc59f4e5c39c82aa73dc50b7c5c988c6d075464405db52?placeholderIfAbsent=true&apiKey=dc1dfaeed34d4c05a46eb3603635944e"
            alt=""
            className={styles.icon}
          />
          <p>{eventLocation}</p>
        </div>
        <div className={styles.detailItem}>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/75529e9769c5174929c33d772627c7ecfbc2c4112bb637a5a723d4b29dbbdee3?placeholderIfAbsent=true&apiKey=dc1dfaeed34d4c05a46eb3603635944e"
            alt=""
            className={styles.icon}
          />
          <p>{formatDate(eventDate)}</p>
        </div>
        <div className={styles.detailItem}>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/6590f4c79d6f55dc19c35e6b560d6e332f6ae7cbfee5842225c5ad85051c1947?placeholderIfAbsent=true&apiKey=dc1dfaeed34d4c05a46eb3603635944e"
            alt=""
            className={styles.icon}
          />
          <p>{`${formatTime(startTime)} - ${formatTime(endTime)}`}</p>
        </div>
      </div>
      <div className={styles.actions}>
        {/* Trigger the navigate function with state (eventID) when the button is clicked */}
        <button onClick={handleNavigate} className={styles.actionButton}>
          View
        </button>
      </div>
    </article>
  );
}

export default AppointmentCardMS;
