import React, { useEffect, useState } from 'react';
import styles from './AppointmentTable.module.css';
import AppointmentStatus from './AppointmentStatus';
import AppointmentNoShow from './AppointmentNoShow';

function formatTime(timeString) {
  if (!timeString) return ""; // Check if timeString is undefined
  const [hours, minutes] = timeString.split(":");
  const date = new Date();
  date.setHours(hours, minutes);
  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AppointmentTable({ user, eventID }) {
  const [appointments, setAppointments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const staffID = user?.id;

  const fetchAppointments = () => {
    if (!staffID || !eventID) return;

    fetch(`http://localhost:8081/staff-appointments/${staffID}/${eventID}`)
      .then(response => response.json())
      .then(data => {
        console.log('Fetched appointments:', data);
        setAppointments(data.events || []);
      })
      .catch(error => console.error('Error fetching appointments:', error));
  };

  useEffect(() => {
    fetchAppointments();
  }, [staffID, eventID]);

  const isActionDisabled = (appointment) => {
    return !appointment.name || 
           appointment.status === 'Completed' || 
           appointment.status === 'No Show';
  };

  const getButtonClasses = (appointment, type) => {
    const baseClass = styles.actionButton;
    if (isActionDisabled(appointment)) {
      return `${baseClass} ${styles.disabledButton}`;
    }
    return `${baseClass} ${type === 'reject' ? styles.rejectButton : styles.approveButton}`;
  };

  const handleApproveClick = (appointment) => {
    console.log('Selected appointment:', appointment);
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleRejectClick = async (appointment) => {
    try {
      const response = await fetch(`http://localhost:8081/appointments/${appointment.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete appointment');
      }

      fetchAppointments(); // Refresh appointments after deleting
      
      // Show success message (optional)
      alert('Appointment marked as no-show and deleted successfully');
    } catch (error) {
      console.error('Error deleting appointment:', error);
      alert('Failed to delete appointment. Please try again.');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
    fetchAppointments(); // Refresh appointments after closing modal
  };

  const closeRejectModal = () => {
    setIsRejectModalOpen(false);
    setSelectedAppointment(null);
    fetchAppointments(); // Refresh appointments after closing modal
  };

  const formatTimeRange = (startTime, endTime) => {
    return `${formatTime(startTime)} - ${formatTime(endTime)}`;
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead className={styles.tableHeader}>
          <tr>
            <th className={styles.headerCell}>No.</th>
            <th className={styles.headerCell}>Timeslot</th>
            <th className={styles.headerCell}>Donor Name</th>
            <th className={styles.headerCell}>Status</th>
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
                <td className={styles.tableCell}>
                  <span className={`${styles.status} ${styles[appointment.status?.toLowerCase() || 'pending']}`}>
                    {appointment.status || 'Pending'}
                  </span>
                </td>
                <td className={styles.tableButtonCell}>
                  <button
                    className={getButtonClasses(appointment, 'reject')}
                    disabled={isActionDisabled(appointment)}
                    aria-label="Reject appointment"
                    onClick={() => handleRejectClick(appointment)}
                  >
                    X
                  </button>
                </td>
                <td className={styles.tableButtonCell}>
                  <button
                    className={getButtonClasses(appointment, 'approve')}
                    disabled={isActionDisabled(appointment)}
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
              <td colSpan="6" className={styles.noAppointments}>
                No appointments found for this staff member and event.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {isModalOpen && (
        <AppointmentStatus
          onClose={closeModal}
          appointment={selectedAppointment}
        />
      )}
      {isRejectModalOpen && (
        <AppointmentNoShow
          onClose={closeRejectModal}
          appointment={selectedAppointment}
        />
      )}
    </div>
  );
}