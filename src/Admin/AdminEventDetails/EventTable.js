import React, { useState, useEffect } from "react";
import styles from "./EventTable.module.css";
import { SuccessMessage } from "./SuccessMessage";
import { EditSuccessMessage } from "./EditSuccess";
import { DeleteSuccessMessage } from "./DeleteSuccess";

const EventTable = ({eventList}) => {
  const [events, setEvents] = useState([]); // State to store the fetched events
  const [eventName, setEventName] = useState ('');
  const [eventDate, setEventDate] = useState ('');
  const [eventLocation, setEventLocation] = useState ('');
  const [eventStartTime, setEventStartTime] = useState ('');
  const [eventEndTime, setEventEndTime] = useState ('');
  const [eventStatus, setEventStatus] = useState('ongoing');
  const [eventToDelete, setEventToDelete] = useState(null);
  const [eventToEdit, setEventToEdit] = useState(null); 
  const [editedEvent, setEditedEvent] = useState({ 
    eventName: "", 
    eventDate: "", 
    eventLocation: "", 
    startTime: "",
    endTime: "", 
    status: "",
  });

  const [isPopupOpen, setIsPopupOpen] = useState(false); /*To add event*/
  const [isUpdatePopupOpen, setIsUpdatePopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);
  const [isEditSuccessPopupOpen, setIsEditSuccessPopupOpen] = useState(false);
  const [isDeleteSuccessPopupOpen, setIsDeleteSuccessPopupOpen] = useState(false);

  // Function format date
  function formatDateOnly(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  }

  // Fetch data from the server when the component mounts
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:8081/admin-event");
        const data = await response.json();

        console.log("Fetched events data:", data); // Log the fetched data
      
        setEvents(data.events); // Set the events data in the state
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  const togglePopup = () => { 
    setIsPopupOpen(!isPopupOpen);  
  };

  const toggleUpdatePopup = (event) => { 
    setEventToEdit(event); 
    
    setEditedEvent({ 
      eventName: event.eventName, 
      eventDate: formatDateOnly(event.eventDate), 
      eventLocation: event.eventLocation, 
      startTime: event.startTime, 
      endTime: event.endTime, 
      status: event.status, 
    }); 
    setIsUpdatePopupOpen(!isUpdatePopupOpen); 
  };

  const toggleDeletePopup = (eventID) => { 
    setEventToDelete(eventID);
    setIsDeletePopupOpen(!isDeletePopupOpen); 
  };

  // Save new event
  const handleSave = async (e) => { 
    e.preventDefault(); 

    if (!eventName || !eventDate || !eventLocation || !eventStartTime || !eventEndTime || !eventStatus) {
      alert("All fields are required.");
      return;
    }
    
    try { 
      const response = await fetch("http://localhost:8081/admin-event", { 
        method: "POST", 
        headers: { 
          "Content-Type": "application/json", 
        }, 
        body: JSON.stringify({
          eventName: eventName,
          eventDate: eventDate,
          eventLocation: eventLocation,
          startTime: eventStartTime,
          endTime: eventEndTime,
          status: eventStatus,
        }), 
      }); 
      
      const data = await response.json(); 
      console.log("Response data:", data); 
      
      if (data.success) { 
        console.log("Event saved successfully"); 
        // Clear input fields 
        setEventName(""); 
        setEventDate(""); 
        setEventLocation(""); 
        setEventStartTime(""); 
        setEventEndTime(""); 
        setEventStatus("ongoing"); 
        
        setIsPopupOpen(false); 
        setIsSuccessPopupOpen(true); 
        setTimeout(() => setIsSuccessPopupOpen(false), 3000); // Hide success message after 3 seconds } else { console.error("Failed to save event:", data.message);
      }
    } catch (error) { 
        console.error("Error saving event:", error); 
      }
  };

  // Change input of event details that is updated
  const handleEditChange = (e) => { 
    const { name, value } = e.target; 
    setEditedEvent((prevState) => ({ 
      ...prevState, 
      [name]: value, 
    })); 
  };

  /*Save Updated Event */
  const handleEditSave = async (e) => {
    e.preventDefault();
  
    try {
      // API call to update the event in the database
      const response = await fetch(`http://localhost:8081/admin-event/${eventToEdit.eventID}`, {
        method: 'PUT', // Use PUT method to update
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedEvent), // Send updated event data
      }); 
  
      const data = await response.json();
  
      if (data.success) {
        // Update state after successful update
        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event.eventID === eventToEdit.eventID ? { ...event, ...editedEvent } : event
          )
        );
        setIsUpdatePopupOpen(false);
        setIsEditSuccessPopupOpen(true);
        setTimeout(() => setIsEditSuccessPopupOpen(false), 3000);
      } else {
        console.error('Failed to update event:', data.message);
      }
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };
  
  // Delete event
  const handleDelete = async (e) => {
    e.preventDefault();
    console.log("Event to delete:", eventToDelete);

    try {
      // Perform the delete operation in the database via API
      const response = await fetch(`http://localhost:8081/admin-event/${eventToDelete}`, { 
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: eventToDelete }), // Send the event ID to delete
      });

      const data = await response.json();

      if (data.success) {
        setEvents(prevEvents => prevEvents.filter(event => event.eventID !== eventToDelete)); // Removes the event with an ID of eventToDelete from the list of events.
        setIsDeletePopupOpen(false);
        setIsDeleteSuccessPopupOpen(true);
        setTimeout(() => setIsDeleteSuccessPopupOpen(false), 3000);
      } else {
        console.error('Failed to delete event');
      }
    } catch (error) {
      console.error('Error deleting event:', error)
    }
    
    setIsDeletePopupOpen(false);
    setIsDeleteSuccessPopupOpen(true);
    setTimeout(() => setIsDeleteSuccessPopupOpen(false), 3000);
  };
  
  return (
    <div className={styles.overallContainer}>
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
        <tbody> {/* Move class here */}
          {events.map((event, index) => (
            <tr key={event.id} className={styles.tableRow}>
              <td className={styles.tableCell}>{index + 1}</td>
              <td className={styles.tableCell}>{event.eventName}</td>
              <td className={styles.tableCell}>{formatDateOnly(event.eventDate)}</td>
              <td className={styles.tableCell}>{event.eventLocation}</td>
              <td className={styles.tableCell}>{event.startTime}</td>
              <td className={styles.tableCell}>{event.endTime}</td>
              <td className={styles.tableCell}>{event.status.charAt(0).toUpperCase() + event.status.slice(1)}</td> 
              <td className={styles.tableCell}>
                <img
                  src="/DeleteRow.png"
                  alt="Delete event"
                  className={styles.actionIcon}
                  onClick={() => toggleDeletePopup(event.eventID)}
                />
              </td>
              <td className={styles.tableCell}>
                <img
                  src="UpdateRow.png"
                  alt="Update event"
                  className={styles.actionIcon}
                  onClick={() => toggleUpdatePopup(event)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

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
            <form className={styles.formContainer}  onSubmit={handleSave}>
              <label className={styles.formLabel}>Event Name</label>
              <input
                type="text"
                placeholder="Event Name"
                value={eventName}
                className={styles.input}
                onChange={(e) => setEventName(e.target.value)}
              ></input>

              <label className={styles.formLabel}>Event Date</label>
              <input 
                type="date" 
                value={eventDate}
                className={styles.input}
                onChange={(e) => setEventDate(e.target.value)}
              ></input>

              <label className={styles.formLabel}>Event Location</label>
              <input
                type="text"
                placeholder="Location"
                value={eventLocation}
                className={styles.input}
                onChange={(e) => setEventLocation(e.target.value)}
              ></input>

              <label className={styles.formLabel}>Start Time</label>
              <input
                type="time"
                value={eventStartTime}
                className={styles.input}
                onChange={(e) => setEventStartTime(e.target.value)}
              ></input>

              <label className={styles.formLabel}>End Time</label>
              <input
                type="time"
                value={eventEndTime}
                className={styles.input}
                onChange={(e) => setEventEndTime(e.target.value)}
              ></input>

              <label className={styles.formLabel}>Status</label>
              <select className={styles.input} value={eventStatus} onChange={(e) => setEventStatus(e.target.value)}>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
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

  {/* Update existing events */}
      {isUpdatePopupOpen && (
        <>
          <div className={styles.overlay} onClick={toggleUpdatePopup}></div>
          <div className={styles.popup}>
            <h2 className={styles.popupTitle}>Update Event</h2>
            <form className={styles.formContainer} onSubmit={handleEditSave}>
              <label className={styles.formLabel}>Event Name</label>
              <input
                type="text"
                name="eventName"
                className={styles.input}
                value={editedEvent.eventName}
                onChange={handleEditChange}
              ></input>

              <label className={styles.formLabel}>Event Date</label>
              <input
                type="date"
                name="eventDate"
                className={styles.input}
                value={editedEvent.eventDate} 
                onChange={handleEditChange}
              ></input>

              <label className={styles.formLabel}>Event Location</label>
              <input
                type="text"
                name="eventLocation"
                className={styles.input}
                value={editedEvent.eventLocation} 
                onChange={handleEditChange}
              ></input>

              <label className={styles.formLabel}>Start Time</label>
              <input
                type="time"
                name="startTime"
                className={styles.input}
                value={editedEvent.startTime} 
                onChange={handleEditChange}
              ></input>

              <label className={styles.formLabel}>End Time</label>
              <input
                type="time"
                name="endTime"
                className={styles.input}
                value={editedEvent.endTime} 
                onChange={handleEditChange}
              ></input>

              <label className={styles.formLabel}>Status</label>
              <select 
                className={styles.input}
                name="status" 
                value={editedEvent.status} 
                onChange={handleEditChange}
              >
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
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

  {/* Delete Existing Events */}
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
