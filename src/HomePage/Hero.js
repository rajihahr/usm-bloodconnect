import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Hero.module.css';
import Button from './Button';

const Hero = ({user}) => {

  const navigate = useNavigate();
  const handleBookNow = () => {
    if (user?.role === 'user') {
      navigate('/questionnaire-start-page'); // Redirect to sign-in page if not signed in
    } else {
      navigate('/sign-in'); // Proceed to booking if signed in
    }
  };

  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <h2 className={styles.title}>Jom Derma Darah 2024</h2>
        <p className={styles.details}>
          Date: 25th December 2024<br />
          Time: 8.00 AM - 5.00 PM<br />
          Venue: Dewan Utama Pelajar, USM
        </p>
        <div className={styles.actionArea}>
          <Button text="Book Now!" variant="cta" onClick={handleBookNow} />
        </div>
      </div>
    </section>
  );
};

export default Hero;