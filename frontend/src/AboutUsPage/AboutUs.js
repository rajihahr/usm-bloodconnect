import React from 'react';
import ProgramInfo from './ProgramInfo';
import OrganizationInfo from './OrganizationInfo';
import styles from './AboutUs.module.css';

function AboutUs() {
  return (
    <div className={styles.background}>
      <main className={styles.mainContent}>
        <ProgramInfo />
        <OrganizationInfo />
      </main>
    </div>
  );
}

export default AboutUs;