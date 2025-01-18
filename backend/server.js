const express = require("express");
const cors = require("cors");
const db = require("./db");

const bodyParser = require("body-parser");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const bcrypt = require("bcrypt");
const saltRounds = 10;
const app = express();

// Middleware setup
app.use(express.json()); 
app.use(bodyParser.json());
app.use(cookieParser());

// Session configuration
app.use(session({
  secret: '4eba08474238b7a30245666cec4ab4b199199473a2fc9020b8d766cf2cf8731f',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: false,
    maxAge: 60 * 60 * 1000 // 1 hour
  }
}));

// Updated CORS configuration to allow credentials
app.use(cors({
  origin: "https://bloodconnect.site",
  // origin: "http://localhost:3000",
  methods: ["GET", "POST", "DELETE", "PUT"],
  allowedHeaders: ["Content-Type"],
  credentials: true
}));

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.status(401).json({ success: false, message: "Not authenticated" });
  }
};

// Sign up with password hashing
app.post("/sign-up", (req, res) => {
  const { donorName, donorEmail, donorPassword, donorDOB } = req.body;

  // Check if all required fields are provided
  if (!donorName || !donorEmail || !donorPassword || !donorDOB) {
    return res.status(400).json({ success: false, message: "All fields are required." });
  }

  // Check if the email already exists
  const checkEmailSql = "SELECT * FROM donor WHERE donorEmail = ?";
  db.query(checkEmailSql, [donorEmail], (err, data) => {
    if (err) {
      console.error("Error querying database:", err);
      return res.status(500).json({ success: false, message: "Server error." });
    }
    if (data.length > 0) {
      return res.status(400).json({ success: false, message: "Email already exists." });
    }

    // Hash the password
    bcrypt.hash(donorPassword, saltRounds, (err, hash) => {
      if (err) {
        console.error("Error hashing password:", err);
        return res.status(500).json({ success: false, message: "Error encrypting password." });
      }

      // Insert new donor into the database
      const insertDonorSql = "INSERT INTO donor (donorName, donorEmail, donorPassword, donorDOB) VALUES (?, ?, ?, ?)";
      db.query(insertDonorSql, [donorName, donorEmail, hash, donorDOB], (err, result) => {
        if (err) {
          console.error("Error inserting donor into database:", err);
          return res.status(500).json({ success: false, message: "Error saving user to database." });
        }
        return res.status(201).json({ success: true, message: "User registered successfully." });
      });
    });
  });
});

// Sign in with session management
app.post("/sign-in", async (req, res) => {
  const { email, password } = req.body;

  try {
    const donorQuery = "SELECT donorID AS id, donorName AS name, donorEmail AS email, donorPassword AS password, 'donor' AS role FROM donor WHERE donorEmail = ?";
    db.query(donorQuery, [email], async (donorErr, donorData) => {
      if (donorErr) {
        return res.json({ error: true, message: "Error querying database." });
      }

      if (donorData.length > 0) {
        const donor = donorData[0];
        const isMatch = await bcrypt.compare(password, donor.password);
        if (isMatch) {
          // Set session data
          req.session.user = {
            id: donor.id,
            name: donor.name,
            email: donor.email,
            role: donor.role
          };
          return res.json({ success: true, user: donor });
        }
      }

      // medicalStaff table
      const medicalStaffQuery = "SELECT staffID AS id, staffName AS name, staffEmail AS email, staffPassword AS password, 'medical-staff' AS role FROM medicalStaff WHERE staffEmail = ?";
      db.query(medicalStaffQuery, [email], async (staffErr, staffData) => {
        if (staffErr) {
          return res.json({ error: true, message: "Error querying database." });
        }
        if (staffData.length > 0) {
          const staff = staffData[0];
          if (password === staff.password) {
            req.session.user = {
              id: staff.id,
              name: staff.name,
              email: staff.email,
              role: staff.role
            };
            return res.json({ success: true, user: staff });
          }
        }

        // admin table
        const adminQuery = "SELECT adminID AS id, adminName AS name, adminEmail AS email, adminPassword AS password, 'admin' AS role FROM admin WHERE adminEmail = ?";
        db.query(adminQuery, [email], async (adminErr, adminData) => {
          if (adminErr) {
            return res.json({ error: true, message: "Error querying database." });
          }

          if (adminData.length > 0) {
            const admin = adminData[0];
            const isMatch = await bcrypt.compare(password, admin.password);
            if (isMatch) {
              req.session.user = {
                id: admin.id,
                name: admin.name,
                email: admin.email,
                role: admin.role
              };
              console.log("Donor Session data:", req.session);
              console.log("Donor Session ID:", req.sessionID);
              return res.json({ success: true, user: admin });
            }
          }

          return res.json({
            success: false,
            message: "Invalid email or password.",
          });
        });
      });
    });

  } catch (err) {
    console.error("Error processing sign-in:", err);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
});

// New route to check authentication status
app.get("/check-auth", (req, res) => {
  if (req.session.user) {
    res.json({ 
      isAuthenticated: true, 
      user: req.session.user 
    });
  } else {
    res.json({ 
      isAuthenticated: false 
    });
  }
});

// Sign out
app.post("/sign-out", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Error logging out" });
    }
    res.clearCookie('connect.sid');
    res.json({ success: true, message: "Logged out successfully" });
  });
});

// Protect routes that require authentication
app.get("/protected-route", isAuthenticated, (req, res) => {
  res.json({ success: true, data: "Protected data" });
});

// ------------------------------------- DONOR SIDE -------------------------------------

// Display Event on HomePage
app.get("/", (req, res) => { 
  const query = "SELECT * FROM event WHERE eventID = 2 ";
  
  db.query(query, (err, eventdata) => {
    if (err) {
      console.error("Error querying events:", err);
      return res.status(500).json({ error: true, message: "Error querying events." });
    }

    if (eventdata.length === 0) {
      return res.json({ events: [], message: "No events found." });
    }

    res.json({ event: eventdata[0] });
  });
});

// Display event details in 'BookAppointment'
app.get("/eventAppointment/:eventID", (req, res) => {
  const eventID = req.params.eventID; // Get eventID from the URL parameter
  
  const query = "SELECT * FROM event WHERE eventID = ?";
  
  db.query(query, [eventID], (err, eventdata) => {
    if (err) {
      console.error("Error querying events:", err);
      return res.status(500).json({ error: true, message: "Error querying events." });
    }

    if (eventdata.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json({ event: eventdata[0] });
  });
});

// Display appointment details in 'AppointmentView' and 'AppointmentHistory'
app.get('/api/appointments/:donorID', (req, res) => {
  const donorID = req.params.donorID;
  const sql = `
    SELECT 
      event.eventID,
      appointment.appointmentID,
      event.eventName AS title, 
      event.eventLocation AS location, 
      DATE_FORMAT(event.eventDate, '%D %M %Y') AS date, 
      medicalStaff.staffName AS doctor, 
      TIME_FORMAT(appointment.startTime, '%H:%i') AS startTime,
      TIME_FORMAT(appointment.endTime, '%H:%i') AS endTime, 
      appointment.status 
    FROM appointment 
    JOIN event ON appointment.eventID = event.eventID 
    JOIN medicalStaff ON appointment.staffID = medicalStaff.staffID 
    WHERE appointment.donorID = ?
  `;

  db.query(sql, [donorID], (err, results) => {
    if (err) {
      console.error('Error fetching appointments:', err);
      res.status(500).send('Error fetching appointments');
      return;
    }

    const formattedResults = results.map(appointment => ({
      ...appointment,
      time: `${appointment.startTime} - ${appointment.endTime}`
    }));
    
    res.json(formattedResults);
  });
});

// Book appointment
app.post('/api/book-appointment', (req, res) => {
  const { donorID, eventID, staffID, startTime, endTime } = req.body;
  const sql = 'INSERT INTO appointment (donorID, eventID, staffID, startTime, endTime) VALUES (?, ?, ?, ?, ?)';

  db.query(sql, [donorID, eventID, staffID, startTime, endTime], (err, results) => {
    if (err) {
      console.error('Error creating appointment:', err);
      res.status(500).send('Error creating appointment');
      return;
    }
    res.status(201).send('Appointment created successfully');
  });
});

// Delete an appointment
app.delete('/api/appointments/:appointmentID', (req, res) => {
  const appointmentID = req.params.appointmentID;
  const sql = 'DELETE FROM appointment WHERE appointmentID = ?';

  db.query(sql, [appointmentID], (err, results) => {
    if (err) {
      console.error('Error deleting appointment:', err);
      res.status(500).send('Error deleting appointment');
      return;
    }
    res.status(200).send('Appointment deleted successfully');
  });
});

// Update an appointment
app.put('/api/appointments/:appointmentID', (req, res) => {
  const appointmentID = req.params.appointmentID;
  const { staffID, startTime, endTime } = req.body;
  const sql = 'UPDATE appointment SET staffID = ?, startTime = ?, endTime = ? WHERE appointmentID = ?';

  db.query(sql, [staffID, startTime, endTime, appointmentID], (err, results) => {
    if (err) {
      console.error('Error updating appointment:', err);
      res.status(500).send('Error updating appointment');
      return;
    }
    res.status(200).send('Appointment updated successfully');
  });
});

// Save feedback responses
app.post("/feedback", (req, res) => {
  const { feedbackText, donorID } = req.body;
  console.log("Feedback submission received:", { feedbackText, donorID });

  const insertFeedbackSql = "INSERT INTO feedback (feedbackText, donorID) VALUES (?, ?)";
  db.query(insertFeedbackSql, [feedbackText, donorID], (err, result) => {
    if (err) {
      console.error("Error  inserting feedback into database:", err);
      return res.status(500).json({ success: false, message: "Error saving feedback to database." });
    }
    console.log("Feedback inserted successfully:", result);
    return res.status(201).json({ success: true, message: "Feedback submitted successfully." });
  });
});

// Fetch questions to display
app.get("/questions", (req, res) => {
  const query = "SELECT * FROM question";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching questions:", err);
      return res.status(500).json({ success: false, message: "Error fetching questions." });
    }
    res.json({ success: true, questions: results });
  });
});

// Save questionnaire responses
app.post('/saveResponses', (req, res) => {
  const responses = req.body; // Get the array of responses from the frontend

  const insertPromises = responses.map((response) => {
    const { donorID, questionID, answer, eventId } = response;

    return new Promise((resolve, reject) => {
      const query = 'INSERT INTO questionResponse (donorID, questionID, response, eventID) VALUES (?, ?, ?, ?)';

      db.query(query, [donorID, questionID, answer, eventId], (err, result) => {
        if (err) {
          console.error('Database error:', err); // Log full error details
          if (err.code === 'ER_DUP_ENTRY') {
            return reject({ code: 'ER_DUP_ENTRY', message: 'Duplicate entry detected' });
          }
          return reject({ code: 'GENERAL_ERROR', message: err.message });
        }
        resolve(result); // Resolve the promise on success
      });
    });
  });

  Promise.all(insertPromises)
    .then(() => {
      res.json({ success: true, message: 'All responses saved successfully.' });
    })
    .catch((err) => {
      console.error('Catch block error:', err); // Log the error coming from reject

      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ success: false, code: 'DUPLICATE_ENTRY', message: 'Duplicate entry detected' });
      } else {
        return res.status(500).json({ success: false, message: 'Error saving responses.', error: err.message });
      }
    });
});


// Fetch feedbacks
app.get("/feedbacks", (req, res) =>
  { const query = "SELECT * FROM feedback";
    db.query(query, (err, results) =>
      { if (err) {
        console.error("Error fetching feedbacks:", err);
        return res.status(500).json({ success: false, message: "Error fetching feedbacks from database." });
      }
      return res.status(200).json({ success: true, feedbacks: results });
    });
  });

// ------------------------------------- ADMIN SIDE -------------------------------------
  
// Delete feedback
app.delete("/feedback/:id", (req, res) => {
  const { id } = req.params;
  const deleteFeedbackSql = "DELETE FROM feedback WHERE feedbackID = ?";
  db.query(deleteFeedbackSql, [id], (err, result) => {
    if (err) {
      console.error("Error deleting feedback from database:", err);
      return res.status(500).json({ success: false, message: "Error deleting feedback from database." });
    } if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Feedback not found." });
    }
    return res.status(200).json({ success: true, message: "Feedback deleted successfully." });
  });
});

// Add New Event Details
app.post("/admin-event", (req, res) => {
  const { eventName, eventDate, eventLocation, startTime, endTime, status } = req.body;

  if (!eventName || !eventDate || !eventLocation || !startTime || !endTime || !status) 
  { 
    return res.status(400).json({ 
    error: true, message: "All fields are required." });
  }

  const addEventsql = 'INSERT INTO event (eventName, eventDate, eventLocation, startTime, endTime, status) VALUES (?, ?, ?, ?, ?, ?)'; 
  const values = [eventName, eventDate, eventLocation, startTime, endTime, status];

  console.log("New event values:", values);

  db.query(addEventsql, values, (err, result) => 
    { if (err) {
      console.error('Error saving the event:', err); 
      return res.status(500).json({ error: true, message: 'Error saving the event.' }); 
    }      
  });
});

// Retrieve Event Details to Display
app.get("/admin-event", (req, res) => { 
    const query = "SELECT * FROM event";

    db.query(query, (err, eventdata) => {
      if (err) {
        console.error("Error querying events:", err);
        return res.status(500).json({ error: true, message: "Error querying events." });
      }

      if (eventdata.length === 0) {
        return res.json({ events: [], message: "No events found." });
      }

      res.json({ events: eventdata });
    });
});

// Update Event Details
app.put("/admin-event/:id", (req, res) => {
  const { id } = req.params; 
  const { eventName, eventDate, eventLocation, startTime, endTime, status } = req.body;

  if (!eventName || !eventDate || !eventLocation || !startTime || !endTime || !status) {
    return res.status(400).json({ error: true, message: "All fields are required." });
  }

  const updateEventSql = 'UPDATE event SET eventName = ?, eventDate = ?, eventLocation = ?, startTime = ?, endTime = ?, status = ? WHERE eventID = ?';
  const values = [eventName, eventDate, eventLocation, startTime, endTime, status, id];

  db.query(updateEventSql, values, (err, result) => {
    if (err) {
      console.error('Error updating the event:', err);
      return res.status(500).json({ error: true, message: 'Error updating the event.' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: true, message: "Event not found." });
    }

    res.status(200).json({ success: true, message: 'Event updated successfully.' });
  });
});

// Delete Event
app.delete("/admin-event/:id", (req, res) => {
  const { id } = req.params;

  const deleteEventSql = "DELETE FROM event WHERE eventID = ?";

  db.query(deleteEventSql, [id], (err, result) => {
    if (err) {
      console.error("Error deleting event:", err);
      return res.status(500).json({ error: true, message: "Error deleting the event." });
    }  
   
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: true, message: "Event not found." });
    }

    res.status(200).json({ success: true, message: "Event deleted successfully." });
  });
});

// Fetch all medical staff
app.get("/api/admin-medical-staff", (req, res) => {
  const sql = "SELECT * FROM medicalStaff";
  db.query(sql, (err, data) => {
    if (err) {
      console.error("Error fetching data:", err);
      return res
        .status(500)
        .json({ success: false, message: "Error fetching data." });
    }
    res.status(200).json(data);
  });
});

// Add medical staff
app.post("/api/add-medical-staff", (req, res) => {
  const { name, email, phone, password } = req.body;

  const checkEmailSql = "SELECT * FROM medicalStaff WHERE staffEmail = ?";
  db.query(checkEmailSql, [email], (err, data) => {
    if (err) {
      console.error("Error querying database:", err);
      return res.status(500).json({
        success: false,
        message: "Error checking email.",
      });
    }
    if (data.length > 0) {
      return res.status(400).json({
        success: false,
        message: "The email address already exists.",
      });
    }

    const sql =
      "INSERT INTO medicalStaff (staffName, staffEmail, staffPhoneNum, staffPassword) VALUES (?, ?, ?, ?)";
    db.query(sql, [name, email, phone, password], (err, data) => {
      if (err) {
        console.error("Error inserting data:", err);
        return res.status(500).json({
          success: false,
          message: "Error adding medical staff to database.",
          error: err.message,
        });
      }
      console.log("Data inserted successfully:", data);
      return res.status(200).json({
        success: true,
        message: "Medical staff added successfully.",
      });
    });
  });
});

// Update medical staff
app.put("/api/update-medical-staff", (req, res) => {
  const { staffID, staffName, staffEmail, staffPhoneNum, staffPassword } =
    req.body;

  const sql =
    "UPDATE medicalStaff SET staffName = ?, staffEmail = ?, staffPhoneNum = ?, staffPassword = ? WHERE staffID = ?";
  db.query(
    sql,
    [staffName, staffEmail, staffPhoneNum, staffPassword, staffID],
    (err) => {
      if (err) {
        console.error("Error updating data:", err);
        return res
          .status(500)
          .json({ success: false, message: "Error updating medical staff." });
      }
      return res.status(200).json({
        success: true,
        message: "Medical staff updated successfully.",
      });
    }
  );
});

// Delete medical staff
app.delete("/api/delete-medical-staff/:staffID", (req, res) => {
  const { staffID } = req.params;
  const sql = "DELETE FROM medicalStaff WHERE staffID = ?";
  db.query(sql, [staffID], (err, data) => {
    if (err) {
      console.error("Error deleting data:", err);
      return res
        .status(500)
        .json({ success: false, message: "Error deleting medical staff." });
    }
    return res
      .status(200)
      .json({ success: true, message: "Medical staff deleted successfully." });
  });
});

app.get("/api/appointments/:staffID/:eventID", (req, res) => {
  const { staffID, eventID } = req.params;
  const sql = "SELECT a.appointmentID, a.startTime, a.endTime, a.status, d.donorName, e.eventLocation, e.eventDate FROM appointment a JOIN donor d ON a.donorID = d.donorID JOIN event e ON a.eventID = e.eventID WHERE a.staffID = ? AND a.eventID = ?";
  db.query(sql, [staffID, eventID], (err, data) => {
    if (err) {
      console.error("Error fetching appointments:", err);
      return res.status(500).json({ success: false, message: "Error fetching appointments." });
    }
    console.log("Fetched appointments from DB:", data); // Debugging log
    res.status(200).json(data);
  });
});

// Delete an appointment by appointmentID
app.delete("/api/appointments/:appointmentID", (req, res) => {
  const { appointmentID } = req.params;
  const sql = "DELETE FROM appointment WHERE appointmentID = ?";
  db.query(sql, [appointmentID], (err, result) => {
    if (err) {
      console.error("Error deleting appointment:", err);
      return res.status(500).json({ success: false, message: "Error deleting appointment." });
    }
    res.status(200).json({ success: true, message: "Appointment deleted successfully." });
  });
});

// Retrieve Event Details for a Specific Staff Member
app.get("/staff-appointments/:staffID", (req, res) => { 
  const { staffID } = req.params;
  
  if (!staffID) {
    return res.status(400).json({ error: true, message: "Staff ID is required." });
  }

  const query = `
    SELECT e.eventName, e.eventLocation, e.eventDate, e.startTime, e.endTime 
    FROM event e
    JOIN appointment a ON e.eventID = a.eventID
    WHERE a.staffID = ?
  `;

  db.query(query, [staffID], (err, appointments) => {
    if (err) {
      console.error("Error querying appointments:", err);
      return res.status(500).json({ error: true, message: "Error querying appointments." });
    }

    if (appointments.length === 0) {
      return res.json({ events: [], message: "No events found for this staff member." });
    }

    res.json({ events: appointments });
  });
});

// Add this endpoint to server.js
app.get('/get-staff-session', (req, res) => {
  // Return the staff data from your session
  if (req.session && req.session.staff) {
    res.json({ staff: req.session.staff });
  } else {
    res.status(401).json({ error: 'No staff session found' });
  }
});

// Retrieve Detailed Appointments for a Specific Staff Member and Event
app.get("/staff-appointments/:staffID/:eventID", (req, res) => { 
  const { staffID, eventID } = req.params;

  if (!staffID || !eventID) {
    return res.status(400).json({ error: true, message: "Staff ID and Event ID are required." });
  }

  console.log(`Fetching appointments for staffID: ${staffID}, eventID: ${eventID}`);

  const query = `
    SELECT 
      a.appointmentID AS id,
      e.eventName,
      e.eventLocation,
      e.eventDate,
      TIME_FORMAT(a.startTime, '%H:%i') AS startTime,
      TIME_FORMAT(a.endTime, '%H:%i') AS endTime,
      d.donorName AS name,
      d.donorID,
      a.status
    FROM appointment a
    LEFT JOIN event e ON e.eventID = a.eventID
    LEFT JOIN donor d ON d.donorID = a.donorID
    WHERE a.staffID = ? AND a.eventID = ?
    ORDER BY a.startTime ASC
  `;

  db.query(query, [staffID, eventID], (err, appointments) => {
    if (err) {
      console.error("Error querying appointments:", err);
      return res.status(500).json({ error: true, message: "Error querying appointments." });
    }

    console.log("Query results:", appointments);

    res.json({ events: appointments });
  });
});

app.get("/events-appointment-view/:eventID", (req, res) => {
  const { eventID } = req.params;  // Retrieve the eventID from the URL

  const query = "SELECT * FROM event WHERE eventID = ?"; 

  db.query(query, [eventID], (err, eventdata) => {
    if (err) {
      console.error("Error querying events:", err);
      return res.status(500).json({ error: true, message: "Error querying events." });
    }

    if (eventdata.length === 0) {
      return res.json({ event: null, message: "No event found." });
    }

    res.json({ event: eventdata[0] });
  });
});

// Fetch blood types
app.get('/blood-types', (req, res) => {
  const query = 'SELECT bloodID, bloodType FROM bloodBank';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching blood types:', err);
      return res.status(500).json({ error: 'Error fetching blood types' });
    }
    res.json(results);
  });
});

// Update donor blood type
app.post('/update-donor-blood', (req, res) => {
  const { donorID, bloodType } = req.body;
  
  const query = 'UPDATE donor SET donorBloodType = ? WHERE donorID = ?';
  
  db.query(query, [bloodType, donorID], (err, result) => {
    if (err) {
      console.error('Error updating donor blood type:', err);
      return res.status(500).json({ error: 'Error updating donor blood type' });
    }
    res.json({ success: true });
  });
});

// Update appointment status
app.post('/update-appointment-status', (req, res) => {
  const { appointmentID, status } = req.body;
  
  const query = 'UPDATE appointment SET status = ? WHERE appointmentID = ?';
  
  db.query(query, [status, appointmentID], (err, result) => {
    if (err) {
      console.error('Error updating appointment status:', err);
      return res.status(500).json({ error: 'Error updating appointment status' });
    }
    res.json({ success: true });
  });
});

// Update blood bank quantity
app.post('/update-blood-quantity', (req, res) => {
  const { bloodID, quantity } = req.body;
  
  const query = 'UPDATE bloodBank SET Quantity = Quantity + ? WHERE bloodID = ?';
  
  db.query(query, [quantity, bloodID], (err, result) => {
    if (err) {
      console.error('Error updating blood quantity:', err);
      return res.status(500).json({ error: 'Error updating blood quantity' });
    }
    res.json({ success: true });
  });
});

app.delete("/appointments/:appointmentId", (req, res) => {
  const { appointmentId } = req.params;

  const query = "DELETE FROM appointment WHERE appointmentID = ?";

  db.query(query, [appointmentId], (error, results) => {
    if (error) {
      console.error("Error deleting appointment:", error);
      return res.status(500).json({ error: "Failed to delete appointment" });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    res.status(200).json({ message: "Appointment deleted successfully" });
  });
});

// Get all blood types and their quantities
app.get("/bloodbank", (req, res) => {
  const query = `
    SELECT bloodType, Quantity as quantity 
    FROM bloodBank 
    ORDER BY bloodType`;

  db.query(query, (err, results) => {
    console.log("Blood bank query results:", results); // Debug log
    if (err) {
      console.error("Error fetching blood bank data:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    const totalQuantity = results.reduce((sum, item) => sum + item.quantity, 0);

    // Count total donors from appointment table where status is 'completed'
    db.query(
      "SELECT COUNT(DISTINCT donorID) as totalDonors FROM appointment WHERE status = 'Completed'",
      (err2, donorResults) => {
        if (err2) {
          console.error("Error fetching donor count:", err2);
          return res.status(500).json({ error: "Internal server error" });
        }

        res.json({
          bloodTypes: results,
          totalDonors: donorResults[0].totalDonors,
          totalBloodUnits: totalQuantity,
        });
      }
    );
  });
});

app.listen(8081, () => {
  console.log("Listening on port 8081");
});