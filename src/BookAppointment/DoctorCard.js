import React, { useState } from 'react';
import styles from './DoctorCard.module.css';

function DoctorCard({ name, timeSlots, isDisabled, onTimeslotSelect }) {
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