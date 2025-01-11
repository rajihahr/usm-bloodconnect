// QuestionnaireForm.js
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import QuestionnaireQuestion from "./QuestionnaireQuestion";
import styles from "./QuestionnaireForm.module.css";
import Popup from "./Popup";
import IneligiblePopup from "./IneligiblePopup";
import IncompleteFormPopup from "./IncompleteFormPopup";
import { Link } from "react-router-dom";

export default function QuestionnaireForm({ user }) {  // Add user prop
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [showEligiblePopup, setShowEligiblePopup] = useState(false);
  const [showIneligiblePopup, setShowIneligiblePopup] = useState(false);
  const [showIncompleteFormPopup, setShowIncompleteFormPopup] = useState(false);
  const [popupData, setPopupData] = useState({ donorID: null, eventID: null });

  // Get eventId from location state, but donorID from user session
  const location = useLocation();
  const { eventId } = location.state || {};
  const donorID = user?.id;  // Get donorID from session

  console.log("Event ID from location:", eventId);
  console.log("Donor ID from session:", donorID);

  useEffect(() => {
    console.log("Event ID:", eventId);
    console.log("User data:", user);  // Log user data to verify
  }, [eventId, user]);

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

  const handleChange = (questionID, value) => {
    setAnswers((prev) => ({ ...prev, [questionID]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (answeredQuestionsCount !== totalQuestions) {
      setShowIncompleteFormPopup(true);
      return;
    }

    // Prepare data to be sent to the backend
    const questionResponses = Object.entries(answers).map(([questionID, answer]) => ({
      questionID,
      answer,
      eventId,
      donorID  // This now comes from the session
    }));
  
    // Send the responses to the backend
    fetch("http://localhost:8081/saveResponses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include',  // Include credentials for session
      body: JSON.stringify(questionResponses),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log("Responses saved successfully");    
          
          const isEligible = Object.values(answers).every((answer) => answer === "No");
          if (isEligible) {
            setShowEligiblePopup(true);
            setPopupData({
              donorID: donorID,
              eventID: eventId, 
            });
          } else {
            setShowIneligiblePopup(true);
          }
        } else {
          console.error("Error saving responses:", data.message); 
        }
      })
      .catch((error) => {
        console.error("Error saving responses:", error);
      });
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
        <Popup message="Let's schedule your appointment so you can make a difference." 
        onClose={handleClosePopup}
        donorID={popupData.donorID}
        eventID={popupData.eventID}
        />
      )}
      {showIneligiblePopup && <IneligiblePopup onClose={handleClosePopup} />}
      {showIncompleteFormPopup && (
        <IncompleteFormPopup message="Please answer all questions before submitting." onClose={handleClosePopup} />
      )}
    </section>
  );
}