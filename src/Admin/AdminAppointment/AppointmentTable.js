import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './AppointmentTable.module.css';
import DeleteAppointment from './DeleteAppointment';

export default function AppointmentTable() {
  const location = useLocation();
  const { staffID, eventID } = location.state; // Retrieve data from state
  const [appointments, setAppointments] = useState([]);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false); // Track rejection modal visibility
  const [selectedAppointment, setSelectedAppointment] = useState(null); // Track selected appointment

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(`http://localhost:8081/api/appointments/${staffID}/${eventID}`);
        const data = await response.json();
        console.log('Fetched appointments:', data);
        setAppointments(data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchAppointments();
  }, [staffID, eventID]);

  const handleRejectClick = (appointment) => {
    setSelectedAppointment(appointment); // Set the selected appointment
    setIsRejectModalOpen(true); // Open rejection modal
  };

  const closeRejectModal = () => {
    setIsRejectModalOpen(false); // Close rejection modal
    setSelectedAppointment(null); // Reset selected appointment
  };

  const handleDeleteAppointment = async (appointmentID) => {
    try {
      const response = await fetch(`http://localhost:8081/api/appointments/${appointmentID}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setAppointments(appointments.filter(appointment => appointment.appointmentID !== appointmentID));
        closeRejectModal();
      } else {
        console.error('Error deleting appointment:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting appointment:', error);
    }
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead className={styles.tableHeader}>
          <tr>
            <th className={styles.headerCell}>No.</th>
            <th className={styles.headerCell}>Event Date</th>
            <th className={styles.headerCell}>Event Location</th>
            <th className={styles.headerCell}>Timeslot</th>
            <th className={styles.headerCell}>Donor Name</th>
            <th className={styles.headerCell}>Status</th>
            <th className={styles.headerCell}></th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment, index) => (
            <tr key={appointment.appointmentID} className={styles.tableRow}>
              <td className={styles.tableCell}>{index + 1}</td>
              <td className={styles.tableCell}>{new Date(appointment.eventDate).toLocaleDateString()}</td>
              <td className={styles.tableCell}>{appointment.eventLocation}</td>
              <td className={styles.tableCell}>{`${appointment.startTime} - ${appointment.endTime}`}</td>
              <td className={styles.tableCell}>{appointment.donorName || '-'}</td>
              <td className={styles.tableCell}>{appointment.status}</td>
              <td className={styles.tableCell}>
                <img
                  src="DeleteRow.png"
                  alt="Delete appointment"
                  className={styles.actionIcon}
                  onClick={() => handleRejectClick(appointment)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isRejectModalOpen && (
        <DeleteAppointment
          onClose={closeRejectModal}
          appointment={selectedAppointment}
          onDelete={handleDeleteAppointment}
        />
      )}
    </div>
  );
}