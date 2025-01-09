import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import styles from './Footer.module.css';

const Footer = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { donorID } = location.state || {};  
  console.log("Donor ID from location:", donorID);

  const handleFeedback = () => {
    if (user?.role === 'donor') {
      navigate('/feedback',{ state: { donorID: donorID} });
    }
  };

  const footerLinks = [
    {
      links: [
        { name: "Home", path: "/" },
        { name: "About Us", path: "/about" },
        { name: "FAQs", path: "/faqs" },
      ],
    },
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.logo}>BLOODCONNECT.</div>
        {footerLinks.map((column, index) => (
          <div key={index} className={styles.linkColumn}>
            <ul className={styles.linkList}>
              {column.links.map((link, linkIndex) => (
                <li key={linkIndex}>
                  <Link to={link.path} className={styles.link}>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Feedback Button - Only visible when user is signed in */}
      {user && (
        <button
          className={styles.feedbackButton}
          onClick={handleFeedback}
        >
          Feedback
        </button>
      )}
    </footer>
  );
};

export default Footer;
