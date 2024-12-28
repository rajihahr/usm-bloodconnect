import React from 'react';
import { Link } from 'react-router-dom';
import styles from './AppointmentCardMS.module.css';

function AppointmentCardMS({ title, location, date, doctor, time, onCancel }) {
  return (
    <article className={styles.appointmentCard}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.details}>
        <div className={styles.detailItem}>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/e33f456ad328b9413bdc59f4e5c39c82aa73dc50b7c5c988c6d075464405db52?placeholderIfAbsent=true&apiKey=dc1dfaeed34d4c05a46eb3603635944e"
            alt=""
            className={styles.icon}
          />
          <p>{location}</p>
        </div>
        <div className={styles.detailItem}>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/75529e9769c5174929c33d772627c7ecfbc2c4112bb637a5a723d4b29dbbdee3?placeholderIfAbsent=true&apiKey=dc1dfaeed34d4c05a46eb3603635944e"
            alt=""
            className={styles.icon}
          />
          <p>{date}</p>
        </div>
        <div className={styles.detailItem}>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/46774d379ae7b4dc6a4dffef30622124b7f14583f7d3dd8e2906d5a566b1439b?placeholderIfAbsent=true&apiKey=dc1dfaeed34d4c05a46eb3603635944e"
            alt=""
            className={styles.icon}
          />
          <p>{doctor}</p>
        </div>
        <div className={styles.detailItem}>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/6590f4c79d6f55dc19c35e6b560d6e332f6ae7cbfee5842225c5ad85051c1947?placeholderIfAbsent=true&apiKey=dc1dfaeed34d4c05a46eb3603635944e"
            alt=""
            className={styles.icon}
          />
          <p>{time}</p>
        </div>
      </div>
      <div className={styles.actions}>
        <Link to="/donor-details">
          <button className={styles.actionButton}>View</button>
        </Link>
      </div>
    </article>
  );
}

export default AppointmentCardMS;

