// QuestionnaireQuestion.js
import React from "react";
import styles from "./QuestionnaireQuestion.module.css";

export default function QuestionnaireQuestion({ question, onChange, value }) {
  return (
    <div className={styles.question}>
      <div className={styles.text}>{question}</div>
      <div className={styles.options}>
        <input
          type="radio"
          className={styles.radio}
          checked={value === "Yes"}
          onChange={() => onChange("Yes")}
          aria-label="Yes"
        />
        <input
          type="radio"
          className={styles.radio}
          checked={value === "No"}
          onChange={() => onChange("No")}
          aria-label="No"
        />
      </div>
    </div>
  );
}