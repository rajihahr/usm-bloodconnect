import React from 'react';
import styles from './FeatureSection.module.css';
import FeatureCard from './FeatureCard';

const FeatureSection = () => {
  const features = [
    {
      title: "Simple Registration and Scheduling",
      description: "Register as a donor, schedule appointments, and get reminders when you're eligible to donate again. We make it easy to give back on your time.",
      imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/46c1040491a2e849ceb94310f1e42b78857aa5104183bb33012523340381b0a7?apiKey=c78782b587ef483eb6a7cfa02a7de9d2&",
      imageAlt: "Registration and scheduling illustration"
    },
    {
      title: "Pre-Donation Questionnaires",
      description: "Before scheduling an appointment, complete a quick questionnaire to ensure you're eligible to donate. We're here to help guide you every step of the way.",
      imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/1756420ae2539fb0e8d133fede7b7b480986b1e57f77f94e933e07ef7ac7d23c?apiKey=c78782b587ef483eb6a7cfa02a7de9d2&",
      imageAlt: "Pre-donation questionnaire illustration"
    },
    {
      title: "Personalized Appointment Scheduling",
      description: "Once eligible, you can schedule an appointment at your convenience, choosing both a time slot and your preferred medical staff. Our system ensures you have a smooth and personalized donation experience.",
      imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/27ed44773cd282f2ae1b8be7b9e12bee25fc4c3c6857b56932656b1942be9e6f?apiKey=c78782b587ef483eb6a7cfa02a7de9d2&",
      imageAlt: "Personalized appointment scheduling illustration"
    }
  ];

  return (
    <section className={styles.featureSection}>
      {features.map((feature, index) => (
        <FeatureCard key={index} {...feature} isReversed={index % 2 !== 0} />
      ))}
    </section>
  );
};

export default FeatureSection;