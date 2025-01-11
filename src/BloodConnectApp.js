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
import { Popup } from './FeedbackPage/Popup';
import { FeedbackPageAdmin } from './Admin/FeedbackAdmin/FeedbackPageAdmin';
import EventsPage from './Admin/AdminEventDetails/EventsPage';
import { BloodBankDashboard } from './Admin/BloodBank/BloodBankDashboard';
import { AppointmentViewMS } from './MedicalStaff/AppointmentViewMS';
import DonationPage from './MedicalStaff/AppointmentDonor';
import { MedicalStaffPage } from './Admin/AdminMedicalStaff/MedicalStaffPage';
import AppointmentHistory from './Appointment/AppointmentHistory';
import { AppointmentList } from './Admin/AdminAppointment/AppointmentList';
import { AppointmentListMedicalStaff} from './Admin/AdminAppointment/AppointmentListMedicalStaff';
import MedicalStaffAppDetails from './Admin/AdminAppointment/MedicalStaffAppDetails';
import ScrollToTop from './ScrollToTop.js';

const BloodConnectApp = () => {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Check authentication status when the app loads
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
      }
    };

    checkAuth();
  }, []);

  const handleSignIn = (userData) => {
    setUser(userData);
    if (userData.role === 'admin') {
      navigate('/admin-home');
    } else if (userData.role === 'medical-staff') {
      navigate('/appointment-view-ms');
    } else {
      navigate('/');
    }
  };

  const handleSignUp = (userData) => {
    setUser(userData); // Save user data (includes role)
      navigate('/sign-in');
  };

  const handleSignOut = async () => {
    try {
      const response = await fetch('http://localhost:8081/logout', {
        method: 'POST',
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (data.success) {
        setUser(null);
        navigate('/');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className={styles.app}>
      <Header user={user} onSignOut={handleSignOut} />
      <main className={styles.main}>
      <ScrollToTop />
        <Routes>
          <Route path="/" element={<Hero user={user} />} />
          <Route path="/sign-in" element={<SignIn onSignIn={handleSignIn} />} />
          <Route path="/sign-up" element={<SignUp onSignUp={handleSignUp} />} />
          <Route path="/faqs" element={<FAQPage />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/feedback-popup" element={<Popup />} />
          <Route path="/" element={<Hero user={user} />} />
          <Route path="/questionnaire-start-page" element={
            user ? <QuestionnaireStartPage user={user} /> : <Navigate to="/sign-in" />}/>
          <Route path="/questions" element={user ? <EligibilityCheck /> : <Navigate to="/sign-in" />}/>
          <Route path="/book-appointment" element={
            user ? <BookAppointment user={user} /> : <Navigate to="/sign-in" />}/>
          <Route path="/confirmation-modal" element={
            user ? <ConfirmationModal user={user} /> : <Navigate to="/sign-in" />}/>
          <Route path="/appointment-view" element={<AppointmentView />} />
          <Route path="/appointment-history" element={<AppointmentHistory />} />
          <Route path="/admin-home" element={user?.role === 'admin' ? <AdminDashboard user={user} /> : <Navigate to="/" />}/>
          <Route path="/admin-feedback" element={<FeedbackPageAdmin />}/>
          <Route path="/admin-event" element={<EventsPage />}/>
          <Route path="/bloodbank" element={<BloodBankDashboard />}/>
          <Route path="/appointment-view-ms" element={user?.role === 'medical-staff' ? <AppointmentViewMS user={user} /> : <Navigate to="/" />}/>
          <Route path="/donor-details" element={<DonationPage />}/>
          <Route path="/admin-medical-staff" element={<MedicalStaffPage />}/>
          <Route path="/admin-appointment" element={<AppointmentList />} />
          <Route path="/admin-appointment-medicalstaff" element={<AppointmentListMedicalStaff />} />
          <Route path="/medicalstaff-app-details" element={<MedicalStaffAppDetails />} />
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
