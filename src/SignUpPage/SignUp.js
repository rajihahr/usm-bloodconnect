import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link, useLocation } from 'react-router-dom';
import { AuthLayout } from './components/AuthLayout';
import { Input } from './components/Input';
import styles from './SignUp.module.css';

const SignUp = ({ onSignUp }) => {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // Define successMessage state
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignUp = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      console.log('Sending sign-up request:', { name, email, dob, password });

      // Send the POST request to the server
      const response = await fetch('http://bloodconnect.site/sign-up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          donorName: name,
          donorEmail: email,
          donorPassword: password,
          donorDOB: dob, // If backend requires this format
        }),
      });

      // Check if response is successful
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error from backend:', errorData);
        setError(errorData.message || 'Failed to sign up.');
        setSuccessMessage('');
        return;
      }

      // Parse JSON response
      const data = await response.json();
      console.log('Sign-up response:', data); // Log server response

      // If successful, display success message and navigate
      if (data.success) {
        setError(''); // Clear any error messages
        setSuccessMessage('Donor added successfully!'); // Set success message
        onSignUp(data.user); // Pass user data to parent (if needed)
        navigate('/sign-in'); // Navigate to homepage or any other page
      } else {
        setSuccessMessage(''); // Clear success message if sign-up fails
        setError(data.message || 'Failed to sign up.');
      }
    } catch (error) {
      console.error('Error during sign-up:', error);
      setError('Something went wrong. Please try again.');
      setSuccessMessage(''); // Clear success message in case of error
    }
  };

  const isFormValid =
    name.trim() !== '' &&
    email.trim() !== '' &&
    dob.trim() !== '' &&
    password.trim() !== '' &&
    confirmPassword.trim() !== '';

  return (
    <AuthLayout>
      <div className={styles.container}>
        <header className={styles.header}>
          <h2 className={styles.welcome}>
            Welcome to <span className={styles.brandText}>BloodConnect</span>
          </h2>
          <nav className={styles.authNav}>
            <Link to="/sign-in" className={styles.navLink}>
              <button className={`${styles.inactiveButton} ${location.pathname === '/sign-in' ? styles.active : ''}`}>
                Sign In
              </button>
            </Link>
            <Link to="/sign-up" className={styles.navLink}>
              <button className={`${styles.activeButton} ${location.pathname === '/sign-up' ? styles.active : ''}`}>
                Sign Up
              </button>
            </Link>
          </nav>
        </header>

        <form className={styles.form} onSubmit={handleSignUp}>
          <Input
            label="Enter your full name"
            placeholder="Full name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            label="Enter your email address"
            placeholder="Email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Enter your date of birth"
            placeholder="DD/MM/YYYY"
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />
          <Input
            label="Enter your password"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            label="Confirm password"
            placeholder="Confirm password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {successMessage && <p className={styles.success}>{successMessage}</p>}
          {error && <p className={styles.error}>{error}</p>}

          <button
            type="submit"
            className={`${styles.submitButton} ${isFormValid ? styles.enabled : styles.disabled}`}
            disabled={!isFormValid}
          >
            Sign Up
          </button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
