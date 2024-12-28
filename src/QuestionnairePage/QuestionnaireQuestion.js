import React from 'react';
import styles from './QuestionnaireQuestion.module.css';

export default function QuestionnaireQuestion({ question, onChange, value }) {
  return (
    <div className={styles.question}>
      <div
        className={styles.text}
        dangerouslySetInnerHTML={{ __html: question }}
      />
      <div className={styles.options}>
        <input
          type="radio"
          className={styles.radio}
          checked={value === 'Yes'} // Match expected "Yes" format
          onChange={() => onChange('Yes')} // Pass "Yes" with correct casing
          name={question}
          aria-label="Yes"
        />
        <input
          type="radio"
          className={styles.radio}
          checked={value === 'No'} // Match expected "No" format
          onChange={() => onChange('No')} // Pass "No" with correct casing
          name={question}
          aria-label="No"
        />
      </div>
    </div>
  );
}