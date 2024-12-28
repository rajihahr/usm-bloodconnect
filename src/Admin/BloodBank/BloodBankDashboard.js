import React from 'react';
import { BloodTypeCard } from './BloodTypeCard';
import styles from './BloodBankDashboard.module.css';

const bloodTypes = [
  { type: 'A+', quantity: 53, iconSrc: 'https://cdn.builder.io/api/v1/image/assets/TEMP/df74991bd00685ce355fc178401b48d527bfb781b20af75db78bc86e49683bce?placeholderIfAbsent=true&apiKey=dc1dfaeed34d4c05a46eb3603635944e' },
  { type: 'B+', quantity: 18, iconSrc: 'https://cdn.builder.io/api/v1/image/assets/TEMP/61bb7519bf47e08377d6c60adb85dc82c806f631b28e489e2cb9aca45c20ded1?placeholderIfAbsent=true&apiKey=dc1dfaeed34d4c05a46eb3603635944e' },
  { type: 'AB+', quantity: 38, iconSrc: 'https://cdn.builder.io/api/v1/image/assets/TEMP/df74991bd00685ce355fc178401b48d527bfb781b20af75db78bc86e49683bce?placeholderIfAbsent=true&apiKey=dc1dfaeed34d4c05a46eb3603635944e' },
  { type: 'O+', quantity: 52, iconSrc: 'https://cdn.builder.io/api/v1/image/assets/TEMP/61bb7519bf47e08377d6c60adb85dc82c806f631b28e489e2cb9aca45c20ded1?placeholderIfAbsent=true&apiKey=dc1dfaeed34d4c05a46eb3603635944e' },
  { type: 'A-', quantity: 21, iconSrc: 'https://cdn.builder.io/api/v1/image/assets/TEMP/df74991bd00685ce355fc178401b48d527bfb781b20af75db78bc86e49683bce?placeholderIfAbsent=true&apiKey=dc1dfaeed34d4c05a46eb3603635944e' },
  { type: 'B-', quantity: 11, iconSrc: 'https://cdn.builder.io/api/v1/image/assets/TEMP/61bb7519bf47e08377d6c60adb85dc82c806f631b28e489e2cb9aca45c20ded1?placeholderIfAbsent=true&apiKey=dc1dfaeed34d4c05a46eb3603635944e' },
  { type: 'AB-', quantity: 8, iconSrc: 'https://cdn.builder.io/api/v1/image/assets/TEMP/df74991bd00685ce355fc178401b48d527bfb781b20af75db78bc86e49683bce?placeholderIfAbsent=true&apiKey=dc1dfaeed34d4c05a46eb3603635944e' },
  { type: 'O-', quantity: 29, iconSrc: 'https://cdn.builder.io/api/v1/image/assets/TEMP/61bb7519bf47e08377d6c60adb85dc82c806f631b28e489e2cb9aca45c20ded1?placeholderIfAbsent=true&apiKey=dc1dfaeed34d4c05a46eb3603635944e' }
];

export const BloodBankDashboard = () => {
  return (
    <main>
    <div className={styles.authContainer}>
      <section className={styles.bloodBankContainer}>
        <h2 className={styles.dashboardTitle}>BloodBank Analytics Dashboard</h2>

        <div className={styles.bloodStatsGrid}>
          {/* First Row: Positive Blood Types */}
          {bloodTypes.slice(0, 4).map((bloodType, index) => (
            <div key={index}>
              <BloodTypeCard
                type={bloodType.type}
                quantity={bloodType.quantity}
                iconSrc={bloodType.iconSrc}
              />
            </div>
          ))}

          {/* Second Row: Negative Blood Types */}
          {bloodTypes.slice(4, 8).map((bloodType, index) => (
            <div key={index + 4}>
              <BloodTypeCard
                type={bloodType.type}
                quantity={bloodType.quantity}
                iconSrc={bloodType.iconSrc}
              />
            </div>
          ))}

          {/* Third Row: Total Donors and Total Blood Unit */}
          <div>
            <BloodTypeCard
              type="Total Donors"
              quantity={53}
              iconSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/36eda7da0cbb7660e9aa269ef00e937660cddb6a07595a3470bff3989be6d662?placeholderIfAbsent=true&apiKey=dc1dfaeed34d4c05a46eb3603635944e"
            />
          </div>

          <div>
            <BloodTypeCard
              type="Total Blood Unit"
              quantity={231}
              iconSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/25bd3b01084e3a98dd8fa7fbe67f26f70c9b8b0f4ccec8411be140cd6c26431f?placeholderIfAbsent=true&apiKey=dc1dfaeed34d4c05a46eb3603635944e"
            />
          </div>
        </div>
      </section>
      </div>
    </main>
  );
};
