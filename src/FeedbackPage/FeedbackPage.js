import React, { useState, useEffect } from "react";
import styles from "./Feedback.module.css";
import Button from "../HomePage/Button";
import { Link, useNavigate, useLocation } from "react-router-dom";

export const FeedbackPage = () => {
  const location = useLocation();
  const { donorID } = location.state || {};
  const [feedbackText, setFeedbackText] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Donor ID from location:", donorID); // Debugging: Log donorID on every render
  }, [donorID]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare feedback data to be sent to the backend
    const feedbackData = {
      feedbackText,
      donorID
    };

    // Send the feedback to the backend to be saved in the database
    fetch("http://localhost:8081/feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(feedbackData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log("Feedback submitted successfully!");
          navigate("/feedback-popup"); // Navigate to the feedback popup page
        } else {
          console.error("Error submitting feedback:", data.message);
        }
      })
      .catch((error) => {
        console.error("Error submitting feedback:", error);
      });
  };

  return (
    <div className={styles.background}>
      <div className={styles.content}>
        <h1 className={styles.title}>Give us a feedback!</h1>
        <p className={styles.description}>Your input is important for us. We take our user feedback very seriously.</p>

        <form className={styles.feedbackContainer} onSubmit={handleSubmit}>
          <div className={styles.textareaWrapper}>
            <textarea
              id="feedback"
              className={styles.feedbackInput}
              placeholder="Add a comment.."
              rows={10}
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
            />
          </div>
          
          <div className={styles.buttonGroup}>
            <Link to='/'>
              <Button text="Home" variant="backButton" />
            </Link>
            <Button text="Submit" variant="cta" type="submit" className={styles.submitButton} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackPage;