import React from "react";
import FeedbackTable from "./FeedbackTable";
import styles from "./FeedbackPageAdmin.module.css";

export const FeedbackPageAdmin = () => {
  return (
    <div className={styles.background}>
      <div className={styles.content}>
        <h1 className={styles.title}>Feedback</h1>
        <FeedbackTable />
      </div>
    </div>
  );
};