import React, { useState } from 'react';
import styles from './AppointmentTable.module.css';
import AppointmentStatus from './AppointmentStatus';
import AppointmentNoShow from './AppointmentNoShow';

const appointments = [
  { id: 1, time: '8.00 AM - 8.30 AM', name: 'John Doe', status: 'pending' },
  { id: 2, time: '8.30 AM - 9.00 AM', name: 'John Doe', status: 'pending' },
  { id: 3, time: '9.00 AM - 9.30 AM', name: 'John Doe', status: 'pending' },
  { id: 4, time: '9.30 AM - 10.00 AM', name: '', status: 'empty' },
  { id: 5, time: '10.00 AM - 10.30 AM', name: 'John Doe', status: 'pending' },
  { id: 6, time: '10.30 AM - 11.00 AM', name: '', status: 'empty' },
  { id: 7, time: '11.00 AM - 11.30 AM', name: 'John Doe', status: 'pending' },
  { id: 8, time: '11.30 AM - 12.00 PM', name: 'John Doe', status: 'pending' },
  { id: 9, time: '12.00 PM - 12.30 PM', name: 'John Doe', status: 'pending' },
  { id: 10, time: '12.30 PM - 1.00 PM', name: 'John Doe', status: 'pending' },
  { id: 11, time: '10.30 AM - 11.00 AM', name: '', status: 'empty' },
  { id: 12, time: '11.00 AM - 11.30 AM', name: 'John Doe', status: 'pending' },
  { id: 13, time: '11.30 AM - 12.00 PM', name: 'John Doe', status: 'pending' },
  { id: 14, time: '12.00 PM - 12.30 PM', name: 'John Doe', status: 'pending' },
  { id: 15, time: '12.30 PM - 1.00 PM', name: 'John Doe', status: 'pending' },
];

export default function AppointmentTable() {
  const [isModalOpen, setIsModalOpen] = useState(false); // Track modal visibility
  const [selectedAppointment, setSelectedAppointment] = useState(null); // Track selected appointment
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false); // Track rejection modal visibility

  const handleApproveClick = (appointment) => {
    setSelectedAppointment(appointment); // Set the selected appointment
    setIsModalOpen(true); // Open modal
  };

  const handleRejectClick = (appointment) => {
    setSelectedAppointment(appointment); // Set the selected appointment
    setIsRejectModalOpen(true); // Open rejection modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close approval modal
    setSelectedAppointment(null); // Reset selected appointment
  };

  const closeRejectModal = () => {
    setIsRejectModalOpen(false); // Close rejection modal
    setSelectedAppointment(null); // Reset selected appointment
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        {/* Table Header */}
        <thead className={styles.tableHeader}>
          <tr>
            <th className={styles.headerCell}>No.</th>
            <th className={styles.headerCell}>Timeslot</th>
            <th className={styles.headerCell}>Donor Name</th>
            <th className={styles.headerCellButton}>No Show</th>
            <th className={styles.headerCellButton}>Completed</th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {appointments
            .map((appointment, index) => (
              <tr key={appointment.id} className={styles.tableRow}>
                <td className={styles.tableCell}>{index + 1}</td> {/* Dynamically display row number */}
                <td className={styles.tableCell}>{appointment.time}</td>
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
            ))}
        </tbody>
      </table>

      {/* Render the modal only when isModalOpen is true */}
      {isModalOpen && <AppointmentStatus onClose={closeModal} appointment={selectedAppointment} />}
      {/* Render the rejection modal */}
      {isRejectModalOpen && (<AppointmentNoShow onClose={closeRejectModal} appointment={selectedAppointment} />)}
    </div>
  );
}
