import React, { useState, useEffect } from 'react';
import AppointmentCard from './AppointmentCard';
import ButtonGroup from './ButtonGroup';
import CancellationPopup from './CancellationPopup';
import styles from './AppointmentView.module.css';

function AppointmentView({ user }) {
  const [appointments, setAppointments] = useState([]);
  const [showCancellationPopup, setShowCancellationPopup] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const donorID = user?.id;
  console.log("Donor ID from session:", donorID);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(`http://localhost:8081/api/appointments/${donorID}`);
        const data = await response.json();
        console.log("Fetched appointment data:", data);
        const filteredAppointments = data.filter(appointment => appointment.status === 'No Show');
        setAppointments(filteredAppointments);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    if (donorID) {
      fetchAppointments();
    }
  }, [donorID]);

  const handleCancelClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowCancellationPopup(true);
  };

  return (
    <div className={styles.appointmentViewContainer}>
      <main className={styles.mainContent}>
        <ButtonGroup />
        <section className={styles.appointmentGrid}>
          {appointments.map((appointment, index) => (
            <AppointmentCard
              key={index}
              {...appointment}
              onCancel={() => handleCancelClick(appointment)} // Passing down the cancel handler
            />
          ))}
        </section>
      </main>

      {showCancellationPopup && (
        <CancellationPopup
          onClose={() => setShowCancellationPopup(false)}
          onConfirm={() => {
            // Handle confirmation logic (like actually canceling the appointment)
            setShowCancellationPopup(false);
          }}
          appointment={selectedAppointment} // Pass the selected appointment to the popup if needed
        />
      )}
    </div>
  );
}

export default AppointmentView;