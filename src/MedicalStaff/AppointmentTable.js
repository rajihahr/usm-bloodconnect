import React, { useEffect, useState } from 'react';
import styles from './AppointmentTable.module.css';
import AppointmentStatus from './AppointmentStatus';
import AppointmentNoShow from './AppointmentNoShow';

function formatTime(timeString) {
  if (!timeString) return ''; // Check if timeString is undefined
  const [hours, minutes] = timeString.split(':');
  const date = new Date();
  date.setHours(hours, minutes);
  return date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

export default function AppointmentTable({ user, eventID }) {
  const [appointments, setAppointments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const staffID = user?.id;

  useEffect(() => {
    if (!staffID || !eventID) return;

    fetch(`http://localhost:8081/staff-appointments/${staffID}/${eventID}`)
      .then(response => response.json())
      .then(data => {
        console.log('Fetched appointments:', data); // Log the fetched data
        setAppointments(data.events || []);
      })
      .catch(error => console.error('Error fetching appointments:', error));
  }, [staffID, eventID]);

  const handleApproveClick = (appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleRejectClick = (appointment) => {
    setSelectedAppointment(appointment);
    setIsRejectModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
  };

  const closeRejectModal = () => {
    setIsRejectModalOpen(false);
    setSelectedAppointment(null);
  };

  const formatTimeRange = (startTime, endTime) => {
    return `${formatTime(startTime)} - ${formatTime(endTime)}`; // Concatenate startTime and endTime
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead className={styles.tableHeader}>
          <tr>
            <th className={styles.headerCell}>No.</th>
            <th className={styles.headerCell}>Timeslot</th>
            <th className={styles.headerCell}>Donor Name</th>
            <th className={styles.headerCellButton}>No Show</th>
            <th className={styles.headerCellButton}>Completed</th>
          </tr>
        </thead>

        <tbody>
          {appointments.length > 0 ? (
            appointments.map((appointment, index) => (
              <tr key={appointment.id} className={styles.tableRow}>
                <td className={styles.tableCell}>{index + 1}</td>
                <td className={styles.tableCell}>
                  {formatTimeRange(appointment.startTime, appointment.endTime)}
                </td>
                <td className={styles.tableCell}>{appointment.name || '-'}</td>
                <td className={styles.tableButtonCell}>
                  <button
                    className={`${styles.actionButton} ${
                      appointment.name ? styles.rejectButton : styles.disabledButton
                    }`}
                    disabled={!appointment.name}
                    aria-label="Reject appointment"
                    onClick={() => handleRejectClick(appointment)}
                  >
                    X
                  </button>
                </td>
                <td className={styles.tableButtonCell}>
                  <button
                    className={`${styles.actionButton} ${
                      appointment.name ? styles.approveButton : styles.disabledButton
                    }`}
                    disabled={!appointment.name}
                    aria-label="Approve appointment"
                    onClick={() => handleApproveClick(appointment)}
                  >
                    ✓
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className={styles.noAppointments}>
                No appointments found for this staff member and event.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {isModalOpen && <AppointmentStatus onClose={closeModal} appointment={selectedAppointment} />}
      {isRejectModalOpen && (<AppointmentNoShow onClose={closeRejectModal} appointment={selectedAppointment} />)}
    </div>
  );
}