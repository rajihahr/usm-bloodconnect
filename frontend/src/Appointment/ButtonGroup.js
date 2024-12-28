import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './ButtonGroup.module.css';

function ButtonGroup() {
  const location = useLocation();

  return (
    <div className={styles.buttonGroup}>
      <Link to="/appointment-view">
        <button
          className={`${styles.button} ${
            location.pathname === '/appointment-view' ? styles.active : ''
          }`}
        >
          Current
        </button>
      </Link>
      <Link to="/appointment-history">
        <button
          className={`${styles.button} ${
            location.pathname === '/appointment-history' ? styles.active : ''
          }`}
        >
          History
        </button>
      </Link>
    </div>
  );
}

export default ButtonGroup;
