import React, { useState } from "react";
import styles from "./MedicalStaffTable.module.css";
import { AddSuccess } from "./AddSuccess";
import { EditSuccessMessage } from "./EditSuccess";
import { DeleteSuccessMessage } from "./DeleteSuccess";

const staffData = [
  {
    id: 1,
    name: "Syaza Sufia binti Roselan",
    email: "syazasufia@gmail.com",
    phone: "+60176652738",
  },
  {
    id: 2,
    name: "Maisarah Qistina binti Meor Sha'azizi",
    email: "maisarahtina@gmail.com",
    phone: "+0136679844",
  },
  {
    id: 3,
    name: "Rajihah binti Rosydi",
    email: "rajihahmrm@gmail.com",
    phone: "+01145532145",
  },
  {
    id: 4,
    name: "Najwa Batrisyia binti Mohamad",
    email: "najwabatrisyia54@gmail.com",
    phone: "+60176653321",
  },
  {
    id: 5,
    name: "Anis Farihah binti Mohd Fuad",
    email: "anisewah@gmail.com",
    phone: "+60138871091",
  },
];

export function MedicalStaffTable() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isUpdatePopupOpen, setIsUpdatePopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);
  const [isEditSuccessPopupOpen, setIsEditSuccessPopupOpen] = useState(false);
  const [isDeleteSuccessPopupOpen, setIsDeleteSuccessPopupOpen] =
    useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  const togglePopup = () => setIsPopupOpen(!isPopupOpen);

  const toggleUpdatePopup = (staff) => {
    setSelectedStaff(staff);
    setIsUpdatePopupOpen(!isUpdatePopupOpen);
  };

  const toggleDeletePopup = (staff) => {
    setSelectedStaff(staff);
    setIsDeletePopupOpen(!isDeletePopupOpen);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsPopupOpen(false);
    setIsSuccessPopupOpen(true); // Successfully save new event popup
    setTimeout(() => setIsSuccessPopupOpen(false), 3000); // Auto-hide the success popup after 3 seconds
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    setIsUpdatePopupOpen(false);
    setIsEditSuccessPopupOpen(true);
    setTimeout(() => setIsEditSuccessPopupOpen(false), 3000);
  };

  const handleDelete = (e) => {
    e.preventDefault();
    setIsDeletePopupOpen(false);
    setIsDeleteSuccessPopupOpen(true);
    setTimeout(() => setIsDeleteSuccessPopupOpen(false), 3000);
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        {/* Table Header */}
        <thead className={styles.tableHeader}>
          <tr>
            <th className={styles.headerCell}>No.</th>
            <th className={styles.headerCell}>Name</th>
            <th className={styles.headerCell}>Email</th>
            <th className={styles.headerCell}>Phone Number</th>
            <th className={styles.headerCell}></th>
            <th className={styles.headerCell}></th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {staffData.map((staff, index) => (
            <tr key={staff.id} className={styles.tableRow}>
              <td className={styles.tableCell}>{index + 1}</td>
              <td className={styles.tableCell}>{staff.name}</td>
              <td className={styles.tableCell}>{staff.email}</td>
              <td className={styles.tableCell}>{staff.phone}</td>
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
        <button className={styles.addMedicalStaffButton} onClick={togglePopup}>
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
                required
              />

              <label className={styles.formLabel}>Email</label>
              <input
                type="email"
                placeholder="Email"
                className={styles.input}
                required
              />

              <label className={styles.formLabel}>Phone Number</label>
              <input
                type="tel"
                placeholder="Phone Number"
                className={styles.input}
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
                <button
                  type="submit"
                  className={styles.submitButton}
                  onClick={handleSave}
                >
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
                defaultValue={selectedStaff.name}
                required
              />

              <label className={styles.formLabel}>Staff Email</label>
              <input
                type="email"
                placeholder="Email"
                className={styles.input}
                defaultValue={selectedStaff.email}
                required
              />

              <label className={styles.formLabel}>Staff Phone Number</label>
              <input
                type="tel"
                placeholder="Phone Number"
                className={styles.input}
                defaultValue={selectedStaff.phone}
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
              Are you sure you want to delete {selectedStaff.name}?
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
  );
}
