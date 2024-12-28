import React from 'react';
import { MedicalStaffTable } from './MedicalStaffTable';
import styles from './MedicalStaffPage.module.css';

export function MedicalStaffPage() {
  return (
    <div className={styles.background}>
      <div className={styles.content}>
        <h1 className={styles.title}>Medical Staff</h1>
        <MedicalStaffTable />
      </div>
    </div>
  );
}
