import React, { useState } from 'react';
import styles from './FeedbackTable.module.css';
import Popup from './Popup';

// Sample feedback data
const initialFeedbacks = [
  { feedbackId: 1, donorId: 'D001', feedback: 'Great experience!' },
  { feedbackId: 2, donorId: 'D002', feedback: 'Very efficient process.' },
  { feedbackId: 3, donorId: 'D003', feedback: 'Friendly staff.' },
  { feedbackId: 4, donorId: 'D004', feedback: 'Comfortable environment.' },
  { feedbackId: 5, donorId: 'D005', feedback: 'Smooth process to schedule an appointment.' },
  { feedbackId: 6, donorId: 'D006', feedback: 'Great way to save time for queueing up.' },
];

export default function FeedbackTable() {
  const [feedbacks, setFeedbacks] = useState(initialFeedbacks);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedFeedbackId, setSelectedFeedbackId] = useState(null);

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
  const confirmDelete = () => {
    const updatedFeedbacks = feedbacks.filter((feedback) => feedback.feedbackId !== selectedFeedbackId);
    setFeedbacks(updatedFeedbacks);
    hidePopup();
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
            <tr key={feedback.feedbackId} className={styles.tableRow}>
              <td className={styles.tableCell}>{feedback.feedbackId}</td>
              <td className={styles.tableCell}>{feedback.donorId}</td>
              <td className={styles.tableCell}>{feedback.feedback}</td>
              <td className={styles.tableButtonCell}>
                 <img 
                  src="/DeleteRow.png" 
                  alt="Delete" 
                  onClick={() => showPopup(feedback.feedbackId)}
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
