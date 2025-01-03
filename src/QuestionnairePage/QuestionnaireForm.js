// QuestionnaireForm.js
import React, { useState, useEffect } from "react";
import QuestionnaireQuestion from "./QuestionnaireQuestion"; // Assuming this is the component for each question
import styles from "./QuestionnaireForm.module.css";
import Popup from "./Popup";
import IneligiblePopup from "./IneligiblePopup";
import IncompleteFormPopup from "./IncompleteFormPopup";
import { Link } from "react-router-dom";

export default function QuestionnaireForm() {
  const [questions, setQuestions] = useState([]); // State to store fetched questions
  const [answers, setAnswers] = useState({}); // Track answers
  const [showEligiblePopup, setShowEligiblePopup] = useState(false);
  const [showIneligiblePopup, setShowIneligiblePopup] = useState(false);
  const [showIncompleteFormPopup, setShowIncompleteFormPopup] = useState(false);

  // Fetch questions from the backend
  useEffect(() => {
    fetch("http://localhost:8081/questions")
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setQuestions(data.questions);
        } else {
          console.error("Error fetching questions:", data.message);
        }
      })
      .catch((error) => console.error("Error fetching questions:", error));
  }, []);

  // Calculate progress percentage
  const answeredQuestionsCount = Object.keys(answers).length;
  const totalQuestions = questions.length;
  const progressPercentage = Math.round((answeredQuestionsCount / totalQuestions) * 100);

  // Handle answer change for each question
  const handleChange = (questionID, value) => {
    setAnswers((prev) => ({ ...prev, [questionID]: value }));
  };

  // Submit handler to check eligibility
  const handleSubmit = (e) => {
    e.preventDefault();

    if (answeredQuestionsCount !== totalQuestions) {
      setShowIncompleteFormPopup(true);
      return;
    }

    const isEligible = Object.values(answers).every((answer) => answer === "No");

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
        <div className={styles.progress} style={{ width: `${progressPercentage}%` }}></div>
      </div>

      <form className={styles.questionnaire} onSubmit={handleSubmit}>
        <div className={styles.header}>
          <div className={styles.headerLabels}>
            <span>Yes</span>
            <span>No</span>
          </div>
        </div>

        <div className={styles.questionList}>
          {questions.map((question) => (
            <QuestionnaireQuestion
              key={question.questionID}
              question={question.questionText}
              value={answers[question.questionID] || ""}
              onChange={(value) => handleChange(question.questionID, value)}
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
        <Popup message="Let's schedule your appointment so you can make a difference." onClose={handleClosePopup} />
      )}
      {showIneligiblePopup && <IneligiblePopup onClose={handleClosePopup} />}
      {showIncompleteFormPopup && (
        <IncompleteFormPopup message="Please answer all questions before submitting." onClose={handleClosePopup} />
      )}
    </section>
  );
}