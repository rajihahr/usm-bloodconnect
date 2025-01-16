import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import Header from './HomePage/Header';
import Hero from './HomePage/Hero';
import FeatureSection from './HomePage/FeatureSection';
import Footer from './HomePage/Footer';
import ContactBar from './HomePage/ContactBar';
import styles from './BloodConnectApp.module.css';
import SignIn from './SignInPage/SignIn';
import SignUp from './SignUpPage/SignUp';
import FAQPage from './FAQPage/FAQPage';
import AboutUs from './AboutUsPage/AboutUs';
import AdminDashboard from './Admin/AdminHomePage/AdminDashboard';
import QuestionnaireStartPage from './QuestionnairePage/QuestionnaireForm';
import EligibilityCheck from './QuestionnairePage/QuestionnaireQuestion';
import BookAppointment from './BookAppointment/BookAppointment';
import ConfirmationModal from './BookAppointment/ConfirmationModal';
import AppointmentView from './Appointment/AppointmentView';
import { FeedbackPage } from './FeedbackPage/FeedbackPage';
import { FeedbackPageAdmin } from './Admin/FeedbackAdmin/FeedbackPageAdmin';
import EventsPage from './Admin/AdminEventDetails/EventsPage';
import { BloodBankDashboard } from './Admin/BloodBank/BloodBankDashboard';
import { AppointmentViewMS } from './MedicalStaff/AppointmentViewMS';
import DonationPage from './MedicalStaff/AppointmentDonor';
import { MedicalStaffPage } from './Admin/AdminMedicalStaff/MedicalStaffPage';
import AppointmentHistory from './Appointment/AppointmentHistory';
import { AppointmentList } from './Admin/AdminAppointment/AppointmentList';
import { AppointmentListMedicalStaff } from './Admin/AdminAppointment/AppointmentListMedicalStaff';
import MedicalStaffAppDetails from './Admin/AdminAppointment/MedicalStaffAppDetails';
import ScrollToTop from './ScrollToTop.js';

const BloodConnectApp = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('http://localhost:8081/check-auth', {
          credentials: 'include'
        });
        const data = await response.json();
        
        if (data.isAuthenticated) {
          setUser(data.user);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setLoading(false); // Ensure loading state is set to false after session check
      }
    };

    checkAuth();
  }, []);

  const handleSignIn = (userData) => {
    setUser(userData); // Save user data (includes role)
    if (userData.role === 'admin') {
      navigate('/admin-home');
    } 
    else if (userData.role === 'medical-staff') {
      navigate('/appointment-view-ms');
    }
    else if (userData.role === 'donor'){
      navigate('/');
    }
  };

  const handleSignUp = (userData) => {
    setUser(userData); // Save user data (includes role)
    navigate('/sign-in');
  };

  const handleSignOut = async () => {
    try {
      const response = await fetch("http://localhost:8081/sign-out", {
        method: "POST",
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        setUser(null);
        navigate('/');
      }
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Add a loading state while checking session
  }

  return (
    <div className={styles.app}>
      <Header user={user} onSignOut={handleSignOut} />
      <main className={styles.main}>
      <ScrollToTop />
        <Routes>
          <Route path="/" element={
            user?.role === 'donor' ? <Hero user={user} /> : <Navigate to="/sign-in" />
          }/>
          <Route path="/sign-in" element={<SignIn onSignIn={handleSignIn} />} />
          <Route path="/sign-up" element={<SignUp onSignUp={handleSignUp} />} />
          <Route path="/faqs" element={
            user?.role === 'donor' ? <FAQPage user={user} /> : <Navigate to="/sign-in" />
          }/>
          <Route path="/about-us" element={
            user?.role === 'donor' ? <AboutUs user={user} /> : <Navigate to="/sign-in" />
          }/>
          <Route path="/feedback" element={
            user?.role === 'donor' ? <FeedbackPage user={user} /> : <Navigate to="/sign-in" />
          }/>
          <Route path="/questionnaire-start-page" element={
            user?.role === 'donor' ? <QuestionnaireStartPage user={user} /> : <Navigate to="/sign-in" />
          }/>
          <Route path="/questions" element={
            user?.role === 'donor' ? <EligibilityCheck user={user} /> : <Navigate to="/sign-in" />
          }/>
          <Route path="/book-appointment" element={
            user?.role === 'donor' ? <BookAppointment user={user} /> : <Navigate to="/sign-in" />
          }/>
          <Route path="/confirmation-modal" element={
            user?.role === 'donor' ? <ConfirmationModal user={user} /> : <Navigate to="/sign-in" />
          }/>
          <Route path="/appointment-view" element={
            user?.role === 'donor' ? <AppointmentView user={user} /> : <Navigate to="/sign-in" />
          }/>
          <Route path="/appointment-history" element={
            user?.role === 'donor' ? <AppointmentHistory user={user} /> : <Navigate to="/sign-in" />
          }/>
          <Route path="/admin-home" element={
            user?.role === 'admin' ? <AdminDashboard user={user} /> : <Navigate to="/sign-in" />
          }/>
          <Route path="/admin-feedback" element={
            user?.role === 'admin' ? <FeedbackPageAdmin user={user} /> :<Navigate to="/sign-in"/>
          }/>
          <Route path="/admin-event" element={
            user?.role === 'admin' ? <EventsPage user={user} /> :<Navigate to="/sign-in"/>
          }/>
          <Route path="/bloodbank" element={
            user?.role === 'admin' ? <BloodBankDashboard user={user} /> :<Navigate to="/sign-in"/>
          }/>
          <Route path="/admin-medical-staff" element={
            user?.role === 'admin' ? <MedicalStaffPage user={user} /> :<Navigate to="/sign-in"/>
          }/>
          <Route path="/admin-appointment" element={
            user?.role === 'admin' ? <AppointmentList user={user} /> :<Navigate to="/sign-in"/>
          }/>
          <Route path="/admin-appointment-medicalstaff" element={
            user?.role === 'admin' ? <AppointmentListMedicalStaff user={user} /> :<Navigate to="/sign-in"/>
          }/>
          <Route path="/medicalstaff-app-details" element={
            user?.role === 'admin' ? <MedicalStaffAppDetails user={user} /> :<Navigate to="/sign-in"/>
          }/>
          <Route path="/appointment-view-ms" element={
            user?.role === 'medical-staff' ? <AppointmentViewMS user={user} /> : <Navigate to="/sign-in" />
          }/>
          <Route path="/donor-details" element={
            user?.role === 'medical-staff' ? <DonationPage user={user} /> :<Navigate to="/sign-in"/>
          }/>
        </Routes>

        {location.pathname === '/' && (
          <>
            <FeatureSection />
            <Footer user={user} />
            <ContactBar />
          </>
        )}
      </main>
    </div>
  );
};

export default BloodConnectApp;