import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import styles from './AppointmentList.module.css';
import { AppointmentCardMedicalStaff } from './AppointmentCardMedicalStaff';

export function AppointmentListMedicalStaff() {
  const location = useLocation();
  const eventTitle = location.state?.title || "No Title Provided"; // Retrieve title from state
  const eventID = location.state?.eventID; // Retrieve eventID from state
  const [medicalStaff, setMedicalStaff] = useState([]);

  console.log('AppointmentListMedicalStaff:', { eventID, eventTitle });

  useEffect(() => {
    const fetchMedicalStaff = async () => {
      try {
        const response = await fetch("http://localhost:8081/api/admin-medical-staff");
        const data = await response.json();

        if (data) {
          setMedicalStaff(data);
        } else {
          console.error("Error fetching medical staff:", data.message);
        }
      } catch (error) {
        console.error("Error fetching medical staff:", error);
      }
    };

    fetchMedicalStaff();
  }, []);

  return (
    <div className={styles.appointmentsContainer}>
      <main className={styles.mainContent}>
        <h2 className={styles.pageTitle}>
          <Link to="/admin-appointment" className={styles.eventTitleLink}>
            {eventTitle}
          </Link>
        </h2>
        <section className={styles.appointmentsList}>
          {medicalStaff.map((staff) => (
            <AppointmentCardMedicalStaff
              key={staff.staffID}
              name={staff.staffName} // Assuming the name field is `staffName`
              eventTitle={eventTitle} // Pass eventTitle as a prop
              staffID={staff.staffID} // Pass staffID as a prop
              eventID={eventID} // Pass eventID as a prop
            />
          ))}
        </section>
      </main>
    </div>
  );
}