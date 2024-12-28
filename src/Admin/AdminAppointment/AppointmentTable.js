import React, { useState } from 'react';
import styles from './AppointmentTable.module.css';
import UpdateAppointment from './UpdateAppointment';
import DeleteAppointment from './DeleteAppointment';

const appointments = [
  { id: 1, date: '25/12/2024', location: 'Dewan Utama Pelajar', time:'08:30 AM - 09:00 AM', name: 'John Doe', status: 'Ongoing' },
  { id: 2, date: '25/12/2024', location: 'Dewan Utama Pelajar', time:'10:00 AM - 10:30 AM', name: 'John Doe 2', status: 'Completed' },
  { id: 3, date: '25/12/2024', location: 'Dewan Utama Pelajar', time:'9:00 AM - 09:30 AM', name: 'Najwa Batrisyia', status: 'No Show' },
];

export default function AppointmentTable() {
  const [isModalOpen, setIsModalOpen] = useState(false); // Track modal visibility
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false); // Track rejection modal visibility
  const [selectedAppointment, setSelectedAppointment] = useState(null); // Track selected appointment

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
            <th className={styles.headerCell}>Event Date</th>
            <th className={styles.headerCell}>Event Location</th>
            <th className={styles.headerCell}>Timeslot</th>
            <th className={styles.headerCell}>Donor Name</th>
            <th className={styles.headerCell}>Status</th>
            <th className={styles.headerCell}></th>
            <th className={styles.headerCell}></th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {appointments
            .map((appointment, index) => (
              <tr key={appointment.id} className={styles.tableRow}>
                <td className={styles.tableCell}>{index + 1}</td> {/* Dynamically display row number */}
                <td className={styles.tableCell}>{appointment.date}</td>
                <td className={styles.tableCell}>{appointment.location}</td>
                <td className={styles.tableCell}>{appointment.time}</td>
                <td className={styles.tableCell}>{appointment.name || '-'}</td>
                <td className={styles.tableCell}>{appointment.status}</td>
                <td className={styles.tableCell}>
                <img
                  src="DeleteRow.png"
                  alt="Delete appointment"
                  className={styles.actionIcon}
                  onClick={() => handleRejectClick(appointment)}
                />
              </td>
              <td className={styles.tableCell}>
                <img
                  src="UpdateRow.png"
                  alt="Edit appointment"
                  className={styles.actionIcon}
                  onClick={() => handleApproveClick(appointment)}
                />
              </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* Render the modal only when isModalOpen is true */}
      {isModalOpen && <UpdateAppointment onClose={closeModal} appointment={selectedAppointment} />}
      {/* Render the rejection modal */}
      {isRejectModalOpen && (<DeleteAppointment onClose={closeRejectModal} appointment={selectedAppointment} />)} 

    </div>
  );
}
