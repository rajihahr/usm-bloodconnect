import React from 'react';
import styles from './FAQPage.module.css';
import FAQAccordion from './FAQAccordion';

const FAQPage = () => {
  const faqData = [
    {
      question: "Who can donate blood?",
      answer: "Generally, individuals aged 17-65 who weigh at least 50 kg and are in good health can donate blood. However, eligibility may vary by country and specific health guidelines."
    },
    {
      question: "How often can I donate blood?",
      answer: "Whole blood donations can typically be made every 8 weeks (56 days), while platelet donations can often be made every 7-14 days. Specific intervals depend on the donation type and the guidelines of the blood bank."
    },
    {
      question: "Is blood donation safe?",
      answer: "Yes, blood donation is safe. Sterile needles and equipment are used once and then discarded, ensuring no risk of infection."
    },
    {
      question: "Can I donate if I'm on medication?",
      answer: "Some medications may temporarily prevent donation. It's best to discuss any medications with the blood bank staff to determine eligibility."
    },
    {
      question: "What should I do before donating blood?",
      answer: "Eat a healthy meal, avoid fatty foods, drink plenty of water, and get a good night's sleep the night before your donation."
    },
    {
      question: "Can I donate if I have recently had a tattoo or piercing?",
      answer: "Many places require a waiting period after getting a tattoo or piercing, typically around 3-6 months. This may vary depending on local regulations."
    },
    {
      question: "Can I donate if I recently traveled abroad?",
      answer: "Some travel locations may restrict donation temporarily due to certain diseases. Check with the blood bank for details."
    },
    {
      question: "Are there any health benefits to donating blood?",
      answer: "While blood donation doesn't have direct health benefits, regular donation can help maintain healthy iron levels for some donors. It also provides a health checkup with every donation."
    },
    {
      question: "How is my blood used after donation?",
      answer: "Donated blood is separated into components (red cells, plasma, platelets) and distributed to hospitals to help patients with trauma, surgery, cancer, anemia, and other conditions."
    }
  ];

  return (
    <div className={styles.faqPage}>
      <main className={styles.mainContent}>
        <section className={styles.faqSection}>
          {faqData.map((faq, index) => (
            <FAQAccordion key={index} question={faq.question} answer={faq.answer} />
          ))}
        </section>
      </main>
    </div>
  );
};

export default FAQPage;