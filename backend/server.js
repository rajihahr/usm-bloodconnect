const express = require("express");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./db"); // Importing db.js to handle database queries

const saltRounds = 10;

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const corsOptions = {
  // origin: "https://bloodconnect.site",
  origin: "http://localhost:3000",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
};
app.use(cors(corsOptions));

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

// User sign-in with password comparison
app.post("/sign-in", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Query donor table
    const donorQuery = "SELECT donorID AS id, donorName AS name, donorEmail AS email, donorPassword AS password, 'donor' AS role FROM donor WHERE donorEmail = ?";
    db.query(donorQuery, [email], async (donorErr, donorData) => {
      if (donorErr) {
        return res.json({ error: true, message: "Error querying database." });
      }

      if (donorData.length > 0) {
        const donor = donorData[0];
        const isMatch = await bcrypt.compare(password, donor.password); // bcrypt for donor
        if (isMatch) {
          return res.json({ success: true, user: donor });
        } else {
          return res.json({ success: false, message: "Invalid email or password." });
        }
      }

      // Query medicalStaff table
      const medicalStaffQuery = "SELECT staffID AS id, staffName AS name, staffEmail AS email, staffPassword AS password, 'medical-staff' AS role FROM medicalStaff WHERE staffEmail = ?";
      db.query(medicalStaffQuery, [email], async (staffErr, staffData) => {  // No bcrypt for medical staff
        if (staffErr) {
          return res.json({ error: true, message: "Error querying database." });
        }
        if (staffData.length > 0) {
          const staff = staffData[0];
          if (password === staff.password) { // Plain text comparison for medical staff
            return res.json({ success: true, user: staff });
          } else {
            return res.json({ success: false, message: "Invalid email or password." });
          }
        }

        // Query admin table
        const adminQuery = "SELECT adminID AS id, adminName AS name, adminEmail AS email, adminPassword AS password, 'admin' AS role FROM admin WHERE adminEmail = ?";
        db.query(adminQuery, [email], async (adminErr, adminData) => {  // bcrypt for admin
          if (adminErr) {
            return res.json({ error: true, message: "Error querying database." });
          }

          if (adminData.length > 0) {
            const admin = adminData[0];
            const isMatch = await bcrypt.compare(password, admin.password); // bcrypt for admin
            if (isMatch) {
              return res.json({ success: true, user: admin });
            } else {
              return res.json({ success: false, message: "Invalid email or password." });
            }
          }

          // No match found in any table
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

// Fetch questions
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

app.listen(8081, () => {
  console.log("Listening on port 8081");
});