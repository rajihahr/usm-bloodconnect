import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import styles from './Hero.module.css';
import Button from './Button';

const Hero = ({ user }) => {
  const [event, setEvent] = useState(null);
  const navigate = useNavigate();
  
  // Remove the location.state usage since we'll use the user prop
  const donorID = user?.id;  // Get donorID directly from the user session
  console.log("Donor ID from session:", donorID);

  const handleBookNow = () => {
    if (user?.role === 'donor') {
      navigate('/questionnaire-start-page', { 
        state: { 
          donorID: donorID, 
          eventId: event.eventID 
        }
      });
    } else {
      navigate('/sign-in');
    }
  };

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
    const fetchEvent = async () => {
      try {
        const response = await fetch("https://bloodconnect.site/");
        const data = await response.json();
        console.log("Fetched event data:", data);
        if (data.event) {
          setEvent(data.event);
        } else {
          console.error("Event not found.");
        }
      } catch (error) {
        console.error("Error fetching event:", error);
      }
    };
    fetchEvent();
  }, []);

  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        {event ? (
          <>
            <h2 className={styles.title}>{event.eventName}</h2>
            <p className={styles.details}>
              Date: {formatDateOnly(event.eventDate)}<br />
              Time: {formatTimeOnly(event.startTime)} - {formatTimeOnly(event.endTime)} <br />
              Venue: {event.eventLocation}
            </p>
            <div className={styles.actionArea}>
              <Button text="Book Now!" variant="cta" onClick={handleBookNow} />
            </div>
          </>
        ) : (
          <p>Loading event details...</p>
        )}
      </div>
    </section>
  );
};

export default Hero;