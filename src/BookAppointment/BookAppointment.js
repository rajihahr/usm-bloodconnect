import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styles from './BookAppointment.module.css';
import DoctorCard from './DoctorCard';
import ConfirmationModal from './ConfirmationModal';

function BookAppointment({ user }) {
  const location = useLocation();
  const { eventID } = location.state || {};  // Get eventId from location state
  const donorID = user?.id;
  console.log("Event ID from questionnaire:", eventID);
  console.log("Donor ID from session:", donorID);

  const [event, setEvent] = useState(null);
  const [medicalStaff, setMedicalStaff] = useState([]); // Store medical staff data
  const [timeSlots, setTimeSlots] = useState([]); // Store time slots
  const [selectedDoctor, setSelectedDoctor] = useState(null); // Track selected doctor
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null); // Track selected time slot
  const [timeslotSelected, setTimeslotSelected] = useState(false); // Track if any time slot is selected
  const [isModalOpen, setIsModalOpen] = useState(false); // Track modal visibility

  const handleTimeslotSelection = (doctorName, timeslot) => {
    if (timeslot) {
      setSelectedDoctor(doctorName);
      setSelectedTimeSlot(timeslot);
      setTimeslotSelected(true);
    } else {
      setSelectedDoctor(null);
      setSelectedTimeSlot(null);
      setTimeslotSelected(false);
    }
  };

const handleConfirmBooking = async () => {
  if (timeslotSelected) {
    try {
      const selectedStaff = medicalStaff.find(staff => staff.staffName === selectedDoctor);
      // Split the selectedTimeSlot to get start and end times
      const [startTime, endTime] = selectedTimeSlot.split(' - ');
      
      // Send the data to the backend
      const response = await fetch('http://localhost:8081/api/book-appointment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          donorID: donorID,
          eventID: eventID,
          staffID: selectedStaff.staffID,
          startTime: startTime.trim(), // Use formatted time
          endTime: endTime.trim() // Use formatted time
        })
      });

      if (response.ok) {
        console.log('Appointment created successfully');
        setIsModalOpen(true); // Open modal on confirm
      } else {
        console.error('Error creating appointment');
      }
    } catch (error) {
      console.error('Error creating appointment:', error);
    }
  }
};


  const closeModal = () => {
    setIsModalOpen(false); // Close modal
  };

  // Function format date
  function formatDateOnly(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
  
    return `${day} / ${month} / ${year}`;
  }

  // Function format time
  function formatTimeOnly(timeString) {
    return timeString.slice(0, 5); // Take the first 5 characters (HH:mm) from the time string
  }

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`http://localhost:8081/eventAppointment/${eventID}`); // Use backticks for string interpolation
        const data = await response.json();

        console.log("Fetched event data:", data); // Log the fetched data
        if (data.event) {
          setEvent(data.event); // Set the specific event directly
          
          // Generate time slots
          const startTime = new Date(`1970-01-01T${data.event.startTime}`);
          const endTime = new Date(`1970-01-01T${data.event.endTime}`);
          const slots = [];

          while (startTime < endTime) {
            const slotEnd = new Date(startTime.getTime() + 30 * 60000);
            slots.push(`${startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${slotEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
            startTime.setTime(startTime.getTime() + 30 * 60000);
          }

          setTimeSlots(slots);
        } else {
          console.error("Event not found.");
        }
      } catch (error) {
        console.error("Error fetching event:", error);
      }
    };

    fetchEvent();
  }, [eventID]);

  // Fetch medical staff data
  useEffect(() => {
    const fetchMedicalStaff = async () => {
      try {
        const response = await fetch('http://localhost:8081/api/admin-medical-staff'); // Adjust the URL to your backend endpoint
        const data = await response.json();

        setMedicalStaff(data); // Update state with fetched data
      } catch (error) {
        console.error("Error fetching medical staff:", error);
      }
    };

    fetchMedicalStaff();
  }, []);

  return (
    <div className={styles.bookAppointment}>
      <main className={styles.content}>
        <section className={styles.eventInfo}>
          {event ? (
            <h1 className={styles.eventTitle}>{event.eventName} — Book your appointment now!</h1>
          ) : (
            <h1 className={styles.eventTitle}>Loading event details...</h1>
          )}

          {/* Display event details if available */}
          {event ? (
            <p className={styles.eventDetails}>
              Date: {formatDateOnly(event.eventDate)}<br />
              Time: {formatTimeOnly(event.startTime)} - {formatTimeOnly(event.endTime)} <br />
              Venue: {event.eventLocation}
            </p>
          ) : (
            <p>Loading event details...</p>
          )}
        </section>
        <div className={styles.doctorGrid}>
          {medicalStaff.map((staff, index) => (
            <DoctorCard 
              key={index} 
              name={staff.staffName} 
              timeSlots={timeSlots} // Pass the dynamic time slots to DoctorCard
              isDisabled={timeslotSelected && selectedDoctor !== staff.staffName}
              onTimeslotSelect={handleTimeslotSelection}
            />
          ))}
        </div>
      </main>
      <footer className={styles.actions}>
        <button 
          className={`${styles.confirmButton} ${!timeslotSelected ? styles.disabled : ''}`} 
          disabled={!timeslotSelected}
          onClick={handleConfirmBooking}
        >
          Confirm
        </button>
      </footer>

      {/* Render the modal only when isModalOpen is true */}
      {isModalOpen && <ConfirmationModal onClose={closeModal} />}
    </div>
  );
}

export default BookAppointment;