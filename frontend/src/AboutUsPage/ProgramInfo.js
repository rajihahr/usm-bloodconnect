import React from 'react';
import styles from './ProgramInfo.module.css';

function ProgramInfo() {
  return (
    <section className={styles.programInfo}>
      <div className={styles.content}>
        <h2 className={styles.title}>What are Blood Donation programs?</h2>
        <p className={styles.description}>
          Pusat Sejahtera proudly organizes <strong>Annual Blood Donation Programs</strong> to bring together individuals from all walks of life to make a life-saving impact. This program is designed to encourage regular blood donations and addressing the ongoing need for blood supplies in hospitals and healthcare facilities.
        </p>
        <p className={styles.description}>
          Partnerships with healthcare professionals and volunteers creates a supportive environment for donors ensuring a safe, smooth, and meaningful donation experience. Join us in this life-giving tradition and help make a difference in the lives of those who need it most.
        </p>
      </div>
      <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/677f4ee2137d75a0278c3c480a2592079d3d3d62f6a780f0b41d408dc07b418a?apiKey=c78782b587ef483eb6a7cfa02a7de9d2&" alt="Blood donation illustration" className={styles.image} />
    </section>
  );
}

export default ProgramInfo;