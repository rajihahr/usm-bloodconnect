import React, { useState, useEffect } from "react";
import styles from "./MedicalStaffTable.module.css";
import { AddSuccess } from "./AddSuccess";
import { EditSuccessMessage } from "./EditSuccess";
import { DeleteSuccessMessage } from "./DeleteSuccess";

export function MedicalStaffTable() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isUpdatePopupOpen, setIsUpdatePopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);
  const [isEditSuccessPopupOpen, setIsEditSuccessPopupOpen] = useState(false);
  const [isDeleteSuccessPopupOpen, setIsDeleteSuccessPopupOpen] =
    useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [staffData, setStaffData] = useState([]); // To store staff data from the API
  const [newStaff, setNewStaff] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  // Function to fetch staff data
  const fetchStaffData = async () => {
    try {
      const response = await fetch(
        "http://localhost:8081/api/admin-medical-staff"
      );
      if (response.ok) {
        const data = await response.json();
        setStaffData(data);
      } else {
        console.error("Failed to fetch staff data");
      }
    } catch (error) {
      console.error("Error fetching staff data", error);
    }
  };

  useEffect(() => {
    fetchStaffData();
  }, []);

  const togglePopup = () => {
    // Clear the newStaff state first
    if (!isPopupOpen) {
      setNewStaff({
        name: "",
        email: "",
        phone: "",
        password: "",
      });
    }
    // Then toggle the popup state
    setIsPopupOpen(!isPopupOpen);
  };

  // Handle the form input changes for adding a new staff member
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStaff((prevState) => ({
      ...prevState,
      [name]: value, // Dynamically update the state based on the input's name
    }));
  };

  const toggleUpdatePopup = (staff) => {
    setSelectedStaff({ ...staff });
    setIsUpdatePopupOpen(true);
  };

  const toggleDeletePopup = (staff) => {
    setSelectedStaff(staff);
    setIsDeletePopupOpen(!isDeletePopupOpen);
  };

  // Handle the Save button in the Add Staff form
  const handleSave = async (e) => {
    e.preventDefault();
    console.log("Saving new staff:", newStaff); // Debugging log

    try {
      // Send a POST request to save the new staff data
      const response = await fetch(
        "http://localhost:8081/api/add-medical-staff",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newStaff),
        }
      );

      if (response.ok) {
        const savedStaff = await response.json(); // Get the saved staff data from the response
        setStaffData([...staffData, savedStaff]); // Update the table with the new staff data
        setIsPopupOpen(false); // Close the popup
        setIsSuccessPopupOpen(true); // Show the success popup
        fetchStaffData();
        setTimeout(() => setIsSuccessPopupOpen(false), 1000); // Auto-hide the success popup after 3 seconds
      } else {
        console.error("Failed to save new staff data");
      }
    } catch (error) {
      console.error("Error saving new staff", error);
    }
  };
  // Handle the Update button in the Edit Staff form
  const handleUpdate = async (e) => {
    e.preventDefault();
    console.log("Updating staff:", selectedStaff); // Debugging log

    try {
      // Send a PUT request to update the staff data
      const response = await fetch(
        `http://localhost:8081/api/update-medical-staff`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(selectedStaff),
        }
      );

      if (response.ok) {
        setIsUpdatePopupOpen(false); // Close the popup
        setIsEditSuccessPopupOpen(true); // Show the success popup
        fetchStaffData();
        setTimeout(() => setIsEditSuccessPopupOpen(false), 3000); // Auto-hide the success popup after 3 seconds
      } else {
        console.error("Failed to update staff data");
      }
    } catch (error) {
      console.error("Error updating staff", error);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    console.log("Deleting staff:", selectedStaff); // Debugging log

    try {
      // Send a DELETE request to delete the staff data
      const response = await fetch(
        `http://localhost:8081/api/delete-medical-staff/${selectedStaff.staffID}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setIsDeletePopupOpen(false); // Close the popup
        setIsDeleteSuccessPopupOpen(true); // Show the success popup
        fetchStaffData(); // Refresh the staff data
        setTimeout(() => setIsDeleteSuccessPopupOpen(false), 3000); // Auto-hide the success popup after 3 seconds
      } else {
        console.error("Failed to delete staff data");
      }
    } catch (error) {
      console.error("Error deleting staff", error);
    }
  };

  return (
    <div className="styles.overallContainer">
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          {/* Table Header */}
          <thead className={styles.tableHeader}>
            <tr>
              <th className={styles.headerCell}>No.</th>
              <th className={styles.headerCell}>Name</th>
              <th className={styles.headerCell}>Email</th>
              <th className={styles.headerCell}>Phone Number</th>
              <th className={styles.headerCell}>Password</th>
              <th className={styles.headerCell}></th>
              <th className={styles.headerCell}></th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {staffData.map((staff, index) => (
              <tr key={staff.staffId} className={styles.tableRow}>
                <td className={styles.tableCell}>{index + 1}</td>
                <td className={styles.tableCell}>{staff.staffName}</td>
                <td className={styles.tableCell}>{staff.staffEmail}</td>
                <td className={styles.tableCell}>{staff.staffPhoneNum}</td>
                <td className={styles.tableCell}>{staff.staffPassword}</td>
                <td className={styles.tableCell}>
                  <img
                    src="DeleteRow.png"
                    alt="Delete staff"
                    className={styles.actionIcon}
                    onClick={() => toggleDeletePopup(staff)}
                  />
                </td>
                <td className={styles.tableCell}>
                  <img
                    src="UpdateRow.png"
                    alt="Edit staff"
                    className={styles.actionIcon}
                    onClick={() => toggleUpdatePopup(staff)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Add Medical Staff  */}
        <div className={styles.buttonContainer}>
          <button
            className={styles.addMedicalStaffButton}
            onClick={togglePopup}
          >
            Add Medical Staff
          </button>
        </div>

        {/* Add Staff Popup */}
        {isPopupOpen && (
          <>
            <div className={styles.overlay} onClick={togglePopup}></div>
            <div className={styles.popup}>
              <h2 className={styles.popupTitle}>Add New Medical Staff</h2>

              <form className={styles.formContainer} onSubmit={handleSave}>
                <label className={styles.formLabel}>Staff Name</label>
                <input
                  type="text"
                  placeholder="Staff Name"
                  className={styles.input}
                  name="name"
                  value={newStaff.name}
                  onChange={handleInputChange}
                  required
                />

                <label className={styles.formLabel}>Email</label>
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={newStaff.email}
                  onChange={handleInputChange}
                  className={styles.input}
                  required
                />

                <label className={styles.formLabel}>Phone Number</label>
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className={styles.input}
                  name="phone"
                  value={newStaff.phone}
                  onChange={handleInputChange}
                  required
                />

                <label className={styles.formLabel}>Password</label>
                <input
                  type="password"
                  placeholder=""
                  className={styles.input}
                  name="password"
                  value={newStaff.password}
                  onChange={handleInputChange}
                  required
                />

                <div className={styles.buttonGroup}>
                  <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={togglePopup}
                  >
                    Cancel
                  </button>
                  <button type="submit" className={styles.submitButton}>
                    Save
                  </button>
                </div>
              </form>
            </div>
          </>
        )}

        {isSuccessPopupOpen && (
          <>
            <div
              className={styles.overlay}
              onClick={() => setIsSuccessPopupOpen(false)}
            ></div>
            <div className={styles.successPopup}>
              <AddSuccess />
            </div>
          </>
        )}

        {/* Update Staff Popup */}
        {isUpdatePopupOpen && selectedStaff && (
          <>
            <div
              className={styles.overlay}
              onClick={() => setIsUpdatePopupOpen(false)}
            ></div>
            <div className={styles.popup}>
              <h2 className={styles.popupTitle}>Edit Medical Staff</h2>
              <form className={styles.formContainer} onSubmit={handleUpdate}>
                <label className={styles.formLabel}>Staff Name</label>
                <input
                  type="text"
                  placeholder="Staff Name"
                  className={styles.input}
                  name="name"
                  value={selectedStaff.staffName}
                  onChange={(e) =>
                    setSelectedStaff({
                      ...selectedStaff,
                      staffName: e.target.value,
                    })
                  }
                  required
                />

                <label className={styles.formLabel}>Staff Email</label>
                <input
                  type="email"
                  placeholder="Email"
                  className={styles.input}
                  name="email"
                  value={selectedStaff.staffEmail}
                  onChange={(e) =>
                    setSelectedStaff({
                      ...selectedStaff,
                      staffEmail: e.target.value,
                    })
                  }
                  required
                />

                <label className={styles.formLabel}>Staff Phone Number</label>
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className={styles.input}
                  name="phone"
                  value={selectedStaff.staffPhoneNum}
                  onChange={(e) =>
                    setSelectedStaff({
                      ...selectedStaff,
                      staffPhoneNum: e.target.value,
                    })
                  }
                  required
                />

                <label className={styles.formLabel}>Staff Password</label>
                <input
                  type="password"
                  placeholder="Password"
                  className={styles.input}
                  name="password"
                  value={selectedStaff.staffPassword}
                  onChange={(e) =>
                    setSelectedStaff({
                      ...selectedStaff,
                      password: e.target.value,
                    })
                  }
                  required
                />

                <div className={styles.buttonGroup}>
                  <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={() => setIsUpdatePopupOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className={styles.submitButton}>
                    Save
                  </button>
                </div>
              </form>
            </div>
          </>
        )}

        {isEditSuccessPopupOpen && (
          <>
            <div
              className={styles.overlay}
              onClick={() => setIsEditSuccessPopupOpen(false)}
            ></div>
            <div className={styles.successPopup}>
              <EditSuccessMessage />
            </div>
          </>
        )}

        {/* Delete Staff Popup */}
        {isDeletePopupOpen && selectedStaff && (
          <>
            <div
              className={styles.overlay}
              onClick={() => setIsDeletePopupOpen(false)}
            ></div>
            <div className={styles.popup}>
              <h2 className={styles.popupTitle}>Delete Staff</h2>
              <p className={styles.popupMessage}>
                Are you sure you want to delete {selectedStaff.staffName}?
              </p>
              <div className={styles.buttonGroup}>
                <button
                  className={styles.cancelButton}
                  onClick={() => setIsDeletePopupOpen(false)}
                >
                  Cancel
                </button>
                <button className={styles.confirmButton} onClick={handleDelete}>
                  Confirm
                </button>
              </div>
            </div>
          </>
        )}

        {isDeleteSuccessPopupOpen && (
          <>
            <div
              className={styles.overlay}
              onClick={() => setIsDeleteSuccessPopupOpen(false)}
            ></div>
            <div className={styles.successPopup}>
              <DeleteSuccessMessage />
            </div>
          </>
        )}
      </div>
    </div>
  );
}