import React from 'react';
import styles from './IneligiblePopup.module.css';
import { Link } from 'react-router-dom';

const IneligiblePopup = ({ onClose, onHomeRedirect, onFAQsRedirect }) => {
  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popupContent}>
      <img
          src="/Cancel.png"
          className={styles.cancelIcon}
          alt="Cancel icon"
        />
        <h3 className={styles.popupTitle}>Thank you for completing the questionnaire.</h3>
        <p className={styles.popupMessage}>
          Unfortunately, you’re not eligible to donate.
          <br />
          Please review our guidelines or speak with a healthcare professional for more details.
        </p>
        <div className={styles.buttonContainer}>
        <Link to="/">
          <button className={styles.homeButton} onClick={onHomeRedirect}>
            Home
          </button></Link>
          <Link to="/faqs">
          <button className={styles.faqButton} onClick={onFAQsRedirect}>
            FAQs
          </button></Link>
        </div>
      </div>
    </div>
  );
};

export default IneligiblePopup;