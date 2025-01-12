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
    httpOnly: true,
    maxAge: 60 * 60 * 1000 // 1 hour
  }
}));

// Updated CORS configuration to allow credentials
app.use(cors({
  // origin: "https://bloodconnect.site",
  origin: "http://localhost:3000",
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

  // Create an array of promises for all database insertions
  const insertPromises = responses.map((response) => {
    const { donorID, questionID, answer, eventId } = response;

    return new Promise((resolve, reject) => {
      const query = 'INSERT INTO questionResponse (donorID, questionID, response, eventID) VALUES (?, ?, ?, ?)';

      db.query(query, [donorID, questionID, answer, eventId], (err, result) => {
        if (err) {
          console.error('Error saving response:', err);
          return reject(err); // Reject the promise on error
        }
        console.log(`Response saved for question: ${questionID}`);
        resolve(result); // Resolve the promise on success
      });
    });
  });

  // Wait for all insertions to complete
  Promise.all(insertPromises)
    .then(() => {
      res.json({ success: true, message: 'All responses saved successfully.' });
    })
    .catch((err) => {
      res.status(500).json({ success: false, message: 'Error saving responses.', error: err });
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

app.listen(8081, () => {
  console.log("Listening on port 8081");
});