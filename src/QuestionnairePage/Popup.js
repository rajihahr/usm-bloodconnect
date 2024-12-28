import React from 'react';
import styles from './Popup.module.css';
import { Link } from 'react-router-dom';

const Popup = ({ onClose, onBookAppointment }) => {
  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popupContent}>
      <img
          src="/CheckMark.png"
          className={styles.successIcon}
          alt="Success checkmark"
        />
        <h3 className={styles.popupTitle}>You’re eligible to donate! </h3>
        <p className={styles.popupMessage}>
        Let's schedule your appointment so you can make a difference.
        </p>
        <div className={styles.buttonContainer}>
        <Link to="/">
          <button className={styles.closeButton} onClick={onClose}>
            Home
          </button></Link>
          <Link to="/book-appointment">
          <button className={styles.bookButton} onClick={onBookAppointment}>
            Book Appointment
          </button></Link>
        </div>
      </div>
    </div>
  );
};

export default Popup;
