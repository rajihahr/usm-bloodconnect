import React, { useState } from "react";
import styles from "./EventTable.module.css";
import { SuccessMessage } from "./SuccessMessage";
import { EditSuccessMessage } from "./EditSuccess";
import { DeleteSuccessMessage } from "./DeleteSuccess";

const EventTable = ({ events }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false); /*To add event*/
  const [isUpdatePopupOpen, setIsUpdatePopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);
  const [isEditSuccessPopupOpen, setIsEditSuccessPopupOpen] = useState(false);
  const [isDeleteSuccessPopupOpen, setIsDeleteSuccessPopupOpen] =
    useState(false);

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const toggleUpdatePopup = () => {
    setIsUpdatePopupOpen(!isUpdatePopupOpen);
  };

  const toggleDeletePopup = () => {
    setIsDeletePopupOpen(!isDeletePopupOpen);
  };

  // This is to save the event being added
  const handleSave = (e) => {
    e.preventDefault();
    setIsPopupOpen(false); // Close the Add Event popup
    setIsSuccessPopupOpen(true); // Successfully save new event popup
    setTimeout(() => setIsSuccessPopupOpen(false), 3000); // Auto-hide the success popup after 3 seconds
  };

  const handleEditSave = (e) => {
    e.preventDefault();
    setIsUpdatePopupOpen(false);
    setIsEditSuccessPopupOpen(true);
    setTimeout(() => setIsEditSuccessPopupOpen(false), 3000);
  };

  const handleDelete = (e) => {
    e.preventDefault();
    setIsDeletePopupOpen(false);
    setIsDeleteSuccessPopupOpen(true);
    setTimeout(() => setIsDeleteSuccessPopupOpen(false), 3000);
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        {/* Table Header */}
        <thead className={styles.tableHeader}>
          <tr>
            <th className={styles.headerCell}>No.</th>
            <th className={styles.headerCell}>Event Name</th>
            <th className={styles.headerCell}>Event Date</th>
            <th className={styles.headerCell}>Event Location</th>
            <th className={styles.headerCell}>Start Time</th>
            <th className={styles.headerCell}>End Time</th>
            <th className={styles.headerCell}>Status</th>
            <th className={styles.headerCell}></th>
            <th className={styles.headerCell}></th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {events.map((event, index) => (
            <tr key={event.id} className={styles.tableRow}>
              <td className={styles.tableCell}>{index + 1}</td>
              <td className={styles.tableCell}>{event.name}</td>
              <td className={styles.tableCell}>{event.date}</td>
              <td className={styles.tableCell}>{event.location}</td>
              <td className={styles.tableCell}>{event.startTime}</td>
              <td className={styles.tableCell}>{event.endTime}</td>
              <td className={styles.tableCell}>{event.status}</td>
              <td className={styles.tableCell}>
                <img
                  src="/DeleteRow.png"
                  alt="Delete event"
                  className={styles.actionIcon}
                  onClick={toggleDeletePopup}
                />
              </td>
              <td className={styles.tableCell}>
                <img
                  src="UpdateRow.png"
                  alt="Update event"
                  className={styles.actionIcon}
                  onClick={toggleUpdatePopup}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Event Button */}
      <div className={styles.buttonContainer}>
        <button className={styles.addEventButton} onClick={togglePopup}>
          Add Event
        </button>
      </div>

      {isPopupOpen && (
        <>
          <div className={styles.overlay} onClick={togglePopup}></div>
          <div className={styles.popup}>
            <h2 className={styles.popupTitle}>Add New Event</h2>
            <form className={styles.formContainer}>
              <label className={styles.formLabel}>Event Name</label>
              <input
                type="text"
                placeholder="Event Name"
                className={styles.input}
              ></input>

              <label className={styles.formLabel}>Event Date</label>
              <input type="date" className={styles.input}></input>

              <label className={styles.formLabel}>Event Location</label>
              <input
                type="text"
                placeholder="Location"
                className={styles.input}
              ></input>

              <label className={styles.formLabel}>Start Time</label>
              <select className={styles.input}>
                <option value="09:00">09:00</option>
                <option value="10:00">10:00</option>
                <option value="11:00">11:00</option>
              </select>

              <label className={styles.formLabel}>End Time</label>
              <select className={styles.input}>
                <option value="12:00">12:00</option>
                <option value="13:00">13:00</option>
                <option value="14:00">14:00</option>
              </select>

              <label className={styles.formLabel}>Status</label>
              <select className={styles.input}>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
              </select>

              <div className={styles.buttonGroup}>
                <button
                  type="button"
                  className={styles.closeButton}
                  onClick={togglePopup}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.submitButton}
                  onClick={handleSave}
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {isSuccessPopupOpen && (
        <>
          <div
            className={styles.overlay}
            onClick={() => setIsSuccessPopupOpen(false)}
          ></div>
          <div className={styles.successPopup}>
            <SuccessMessage />
          </div>
        </>
      )}

      {isUpdatePopupOpen && (
        <>
          <div className={styles.overlay} onClick={toggleUpdatePopup}></div>
          <div className={styles.popup}>
            <h2 className={styles.popupTitle}>Update Event</h2>
            <form className={styles.formContainer}>
              <label className={styles.formLabel}>Event Name</label>
              <input
                type="text"
                placeholder="Event Name"
                className={styles.input}
                value="Jom Derma Darah 2024"
              ></input>

              <label className={styles.formLabel}>Event Date</label>
              <input
                type="date"
                className={styles.input}
                value="2024-12-25"
              ></input>

              <label className={styles.formLabel}>Event Location</label>
              <input
                type="text"
                placeholder="Location"
                className={styles.input}
                value="Dewan Utama Pelajar"
              ></input>

              <label className={styles.formLabel}>Start Time</label>
              <select className={styles.input} value="08:00">
                <option value="08:00">08:00</option>
                <option value="09:00">09:00</option>
                <option value="10:00">10:00</option>
                <option value="11:00">11:00</option>
              </select>

              <label className={styles.formLabel}>End Time</label>
              <select className={styles.input} value="17:00">
                <option value="12:00">12:00</option>
                <option value="13:00">13:00</option>
                <option value="14:00">14:00</option>
                <option value="17:00">17:00</option>
              </select>

              <label className={styles.formLabel}>Status</label>
              <select className={styles.input}>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
              </select>

              <div className={styles.buttonGroup}>
                <button
                  type="button"
                  className={styles.closeButton}
                  onClick={toggleUpdatePopup}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.submitButton}
                  onClick={handleEditSave}
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {isEditSuccessPopupOpen && (
        <>
          <div
            className={styles.overlay}
            onClick={() => setIsEditSuccessPopupOpen(false)}
          ></div>
          <div className={styles.successPopup}>
            <EditSuccessMessage />
          </div>
        </>
      )}

      {isDeletePopupOpen && (
        <>
          <div className={styles.overlay} onClick={toggleDeletePopup}></div>
          <div className={styles.popup}>
            <h2 className={styles.popupTitle}>Delete Event</h2>
            <p className={styles.warningMessage}>
              Are you sure you want to delete this event? This action cannot be
              undone.
            </p>
            <div className={styles.buttonContainer}>
              <button
                className={styles.cancelButton}
                onClick={toggleDeletePopup}
                type="button"
              >
                Cancel
              </button>
              <button
                className={styles.confirmButton}
                onClick={handleDelete}
                type="button"
              >
                Confirm
              </button>
            </div>
          </div>
        </>
      )}

      {isDeleteSuccessPopupOpen && (
        <>
          <div
            className={styles.overlay}
            onClick={() => setIsDeleteSuccessPopupOpen(false)}
          ></div>
          <div className={styles.successPopup}>
            <DeleteSuccessMessage />
          </div>
        </>
      )}
    </div>
  );
};

export default EventTable;
