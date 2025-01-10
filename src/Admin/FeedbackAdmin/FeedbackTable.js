import React, { useState, useEffect } from 'react';
import styles from './FeedbackTable.module.css';
import Popup from './Popup';

export default function FeedbackTable() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedFeedbackId, setSelectedFeedbackId] = useState(null);

  // Fetch feedback data from the server
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await fetch('http://localhost:8081/feedbacks');
        const data = await response.json();
        if (data.success) {
          setFeedbacks(data.feedbacks);
        } else {
          console.error("Error fetching feedbacks:", data.message);
        }
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
      }
    };

    fetchFeedbacks();
  }, []);

  // Show the popup and set the selected feedback ID
  const showPopup = (id) => {
    setSelectedFeedbackId(id);
    setIsPopupVisible(true);
  };

  // Hide the popup
  const hidePopup = () => {
    setIsPopupVisible(false);
    setSelectedFeedbackId(null);
  };

  // Confirm deletion and remove the feedback
  const confirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8081/feedback/${selectedFeedbackId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        const updatedFeedbacks = feedbacks.filter((feedback) => feedback.feedbackID !== selectedFeedbackId);
        setFeedbacks(updatedFeedbacks);
        hidePopup();
      } else {
        console.error("Error deleting feedback:", data.message);
      }
    } catch (error) {
      console.error("Error deleting feedback:", error);
    }
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead className={styles.tableHeader}>
          <tr>
            <th className={styles.headerCell}>Feedback ID</th>
            <th className={styles.headerCell}>Donor ID</th>
            <th className={styles.headerCell}>Feedback</th>
            <th className={styles.headerCellButton}></th>
          </tr>
        </thead>
        <tbody>
          {feedbacks.map((feedback) => (
            <tr key={feedback.feedbackID} className={styles.tableRow}>
              <td className={styles.tableCell}>{feedback.feedbackID}</td>
              <td className={styles.tableCell}>{feedback.donorID}</td>
              <td className={styles.tableCell}>{feedback.feedbackText}</td>
              <td className={styles.tableButtonCell}>
                <img 
                  src="/DeleteRow.png" 
                  alt="Delete" 
                  onClick={() => showPopup(feedback.feedbackID)}
                  className={styles.deleteIcon} 
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isPopupVisible && (
        <Popup
          onClose={hidePopup}
          onConfirm={confirmDelete}
          title="Delete Feedback?"
          message="Are you sure you want to delete this feedback? This action cannot be undone."
        />
      )}
    </div>
  );
}