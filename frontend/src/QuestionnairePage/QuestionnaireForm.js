import React, { useState } from 'react';
import QuestionnaireQuestion from './QuestionnaireQuestion'; // Assuming this is the component for each question
import styles from './QuestionnaireForm.module.css';
import Popup from './Popup';
import IneligiblePopup from './IneligiblePopup';
import IncompleteFormPopup from './IncompleteFormPopup';
import { Link } from 'react-router-dom';

const questions = [
  'Do you know or suspect that you may have <strong>HIV</strong>?',
  'Are you suffering from / carrier of <strong>Hepatitis B</strong> or <strong>Hepatitis C</strong>?',
  'Have you been infected by <strong>Syphilis</strong>?',
  'Have you been infected by <strong>other Sexually Transmitted Diseases</strong>?',
  'Do you lead or had led a lifestyle involving <strong>changing multiple sexual partners</strong>?',
  'Are you a <strong>man</strong> who have had sex with <strong>another man</strong> or <strong>bisexual</strong>?',
  'Have you had sex with a <strong>commercial sex worker</strong> (prostitute)?',
  'Have you ever taken <strong>illegal drugs intravenously</strong>?',
  'Have you ever had <strong>sex with any of the previous group?</strong>',
];

export default function QuestionnaireForm() {
  const [answers, setAnswers] = useState({}); // Track answers
  const [showEligiblePopup, setShowEligiblePopup] = useState(false);
  const [showIneligiblePopup, setShowIneligiblePopup] = useState(false);
  const [showIncompleteFormPopup, setShowIncompleteFormPopup] = useState(false);

  // Calculate progress percentage
  const answeredQuestionsCount = Object.keys(answers).length;
  const totalQuestions = questions.length;
  const progressPercentage = Math.round((answeredQuestionsCount / totalQuestions) * 100);

  // Handle answer change for each question
  const handleChange = (question, value) => {
    setAnswers((prev) => ({ ...prev, [question]: value }));
  };

  // Submit handler to check eligibility
  const handleSubmit = (e) => {
    e.preventDefault();

    if (answeredQuestionsCount !== totalQuestions) {
      setShowIncompleteFormPopup(true);
      return;
    }

    const isEligible = questions.every((question) => answers[question] === 'No');

    if (isEligible) {
      setShowEligiblePopup(true);
    } else {
      setShowIneligiblePopup(true);
    }
  };

  const handleClosePopup = () => {
    setShowEligiblePopup(false);
    setShowIneligiblePopup(false);
    setShowIncompleteFormPopup(false);
  };

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>Are you eligible to donate?</h2>
      <p className={styles.subtitle}>
        Please answer all questions truthfully—your honesty helps protect both you and the receiver.
      </p>

      {/* Progress Bar */}
      <div className={styles.progressBar}>
        <div
          className={styles.progress}
          style={{ width: `${progressPercentage}%` }}
        >
        </div>
      </div>

      <form className={styles.questionnaire} onSubmit={handleSubmit}>
        <div className={styles.header}>
          <div className={styles.headerLabels}>
            <span>Yes</span>
            <span>No</span>
          </div>
        </div>

        <div className={styles.questionList}>
          {questions.map((question, index) => (
            <QuestionnaireQuestion
              key={index}
              question={question}
              value={answers[question] || ''}
              onChange={(value) => handleChange(question, value)}
            />
          ))}
        </div>

        <div className={styles.buttons}>
          <Link to="/">
            <button type="button" className={styles.backButton}>
              Home
            </button>
          </Link>
          <button type="submit" className={styles.submitButton}>
            Submit
          </button>
        </div>
      </form>

      {/* Popups */}
      {showEligiblePopup && (
        <Popup
          message="Let's schedule your appointment so you can make a difference."
          onClose={handleClosePopup}
        />
      )}
      {showIneligiblePopup && (
        <IneligiblePopup
          onClose={handleClosePopup}
        />
      )}
      {showIncompleteFormPopup && (
        <IncompleteFormPopup
          message="Please answer all questions before submitting."
          onClose={handleClosePopup}
        />
      )}
    </section>
  );
}
