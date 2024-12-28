import React from 'react';
import styles from './AdminDashboard.module.css';
import { DashboardCard } from './DashboardCard';

const dashboardCards = [
  {
    imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/733a601fcb4aeee62e2a823a2c4f2e70ac26ca003292cea4c906656406eefd12?placeholderIfAbsent=true&apiKey=c78782b587ef483eb6a7cfa02a7de9d2",
    imageAlt: "Event Details Icon",
    buttonText: "Event Details",
    link: "/admin-event"
  },
  {
    imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/833def144b6eb79c53f7f47f45929ac37fbc27afda13a796a4bab9609b68f7e2?placeholderIfAbsent=true&apiKey=c78782b587ef483eb6a7cfa02a7de9d2",
    imageAlt: "Medical Staff Icon",
    buttonText: "Medical Staff",
    link: "/admin-medical-staff"
  },
  {
    imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/c6494cfb76a06a266482227dc10e58d54a36cb4691049e9b9a730de638001742?placeholderIfAbsent=true&apiKey=c78782b587ef483eb6a7cfa02a7de9d2",
    imageAlt: "Appointments Icon",
    buttonText: "Appointments",
    link: "/admin-appointment"
  },
  {
    imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/4777cb3dcaec300c6b053f1a9b95cb80bf21964a7dd977f48f062847bef69f51?placeholderIfAbsent=true&apiKey=c78782b587ef483eb6a7cfa02a7de9d2",
    imageAlt: "Feedback Icon",
    buttonText: "Feedback",
    link: "/admin-feedback"
  },
  {
    imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/ef8bd585e16ede2a97ccabdbd965b762cf875d4287660c7f617aaae2557ba1e5?placeholderIfAbsent=true&apiKey=c78782b587ef483eb6a7cfa02a7de9d2",
    imageAlt: "Blood Bank Icon",
    buttonText: "BloodBank",
    link: "/bloodbank"
  }
];

export default function AdminDashboard() {
  return (
    <main className={styles.adminHomepage}>
      <section className={styles.welcomeSection}>
        <div className={styles.cardGrid}>
          <div className={styles.cardRow}>
            {dashboardCards.slice(0, 3).map((card, index) => (
              <DashboardCard
                key={index}
                imageSrc={card.imageSrc}
                imageAlt={card.imageAlt}
                buttonText={card.buttonText}
                link={card.link}
              />
            ))}
          </div>
          <div className={styles.cardRow}>
            {dashboardCards.slice(3).map((card, index) => (
              <DashboardCard
                key={index + 3}
                imageSrc={card.imageSrc}
                imageAlt={card.imageAlt}
                buttonText={card.buttonText}
                link={card.link}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
