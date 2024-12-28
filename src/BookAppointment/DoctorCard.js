import React, { useState } from 'react';
import styles from './DoctorCard.module.css';

function DoctorCard({ name, isDisabled, onTimeslotSelect }) {
  const timeSlots = [
    '8.00 AM - 8.30 AM',
    '8.30 AM - 9.00 AM',
    '9.00 AM - 9.30 AM',
    '9.30 AM - 10.00 AM',
    '10.00 AM - 10.30 AM',
    '10.30 AM - 11.00 AM',
    '11.00 AM - 11.30 AM',
    '11.30 AM - 12.00 PM',
    '12.00 PM - 12.30 PM',
    '12.30 PM - 1.00 PM',
    '1.00 PM - 1.30 PM',
    '1.30 PM - 2.00 PM',
    '2.00 PM - 2.30 PM',
    '2.30 PM - 3.00 PM',
    '3.00 PM - 3.30 PM',
    '3.30 PM - 4.00 PM',
    '4.00 PM - 4.30 PM',
    '4.30 PM - 5.00 PM'
  ];

  const [selectedTime, setSelectedTime] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);  // State to toggle dropdown visibility

  const handleDropdownToggle = () => {
    if (!isDisabled) {  // Ensure the dropdown is only clickable if not disabled
      setIsDropdownOpen(prevState => !prevState);  // Toggle dropdown visibility
    }
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    onTimeslotSelect(name, time);  // Notify parent component of time selection
    setIsDropdownOpen(false);  // Close dropdown after selection
  };

  return (
    <div className={styles.doctorCard}>
      <h3 className={styles.doctorName}>{name}</h3>
      <div className={styles.timeslotSelector}>
        <div
          className={`${styles.timeslotDropdown} ${isDisabled ? styles.disabledDropdown : ''}`}
          onClick={handleDropdownToggle}
        >
          {selectedTime || 'Select Timeslot'}
        </div>
        {isDropdownOpen && !isDisabled && (
          <ul className={styles.dropdownList}>
            <li
              className={styles.dropdownItem}
              onClick={() => handleTimeSelect('')}  // Select empty value for unselecting
            >
              - Select Timeslot -
            </li>
            {timeSlots.map((time, index) => (
              <li
                key={index}
                className={styles.dropdownItem}
                onClick={() => handleTimeSelect(time)}  // Select time slot
              >
                {time}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default DoctorCard;
