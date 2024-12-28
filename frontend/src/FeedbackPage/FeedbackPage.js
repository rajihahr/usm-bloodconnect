import React from "react";
import styles from "./Feedback.module.css";
import Button from "../HomePage/Button";
import { Link } from "react-router-dom";

export const FeedbackPage = () => {
  return (
    <div className={styles.background}>
      <div className={styles.content}>
        <h1 className={styles.title}>Give us a feedback!</h1>
        <body className={styles.description}>Your input is important for us. We take our user feedback very seriously.</body>

        <form className={styles.feedbackContainer}>
          <div className={styles.textareaWrapper}>
            <textarea
              id="feedback"
              className={styles.feedbackInput}
              placeholder="Add a comment.."
              rows={10}
            />
          </div>
          
          <div className={styles.buttonGroup}>
            <Link to='/'>
            <Button text="Home" variant="backButton" /></Link>
            <Link to='/feedback-popup'>
            <Button text="Submit" variant="cta" /></Link>
          </div>
        </form>
      </div>
    </div>
  );
};