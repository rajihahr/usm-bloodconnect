const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const corsOptions = {
    origin: 'https://bloodconnect.site', // or the URL where your React app is running
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
};

app.use(cors(corsOptions));

const db = mysql.createPool({
    connectionLimit: 10,
    host: "srv1761.hstgr.io",
    user: "u858196522_cmt322group8",
    password: "bloodconnect_USM_group8",
    database: "u858196522_bloodConnect",
});

// Function to handle reconnection
function handleDisconnect() {
    db.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to database:', err);
            setTimeout(handleDisconnect, 2000); // Retry after 2 seconds
        } else {
            console.log('Connected to database');
            if (connection) connection.release();
        }
    });
}

handleDisconnect(); // Start the connection handling

// Global error handlers for uncaught exceptions and rejections
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection:', reason);
});

// User login
app.post('/sign-in', (req, res) => {
    const { email, password } = req.body;

    // Query donor table
    const donorQuery = "SELECT donorEmail AS email, donorPassword AS password, donorRole AS role FROM donor WHERE donorEmail = ? AND donorPassword = ?";
    db.query(donorQuery, [email, password], (donorErr, donorData) => {
        if (donorErr) return res.json({ error: true, message: 'Error querying database.' });
        if (donorData.length > 0) {
            return res.json({ success: true, user: donorData[0] });
        }

        // Query medicalStaff table
        const medicalStaffQuery = "SELECT staffEmail AS email, staffPassword AS password, staffRole AS role FROM medicalStaff WHERE staffEmail = ? AND staffPassword = ?";
        db.query(medicalStaffQuery, [email, password], (staffErr, staffData) => {
            if (staffErr) return res.json({ error: true, message: 'Error querying database.' });
            if (staffData.length > 0) {
                return res.json({ success: true, user: staffData[0] });
            }

            // Query admin table
            const adminQuery = "SELECT adminEmail AS email, adminPassword AS password, adminRole AS role FROM admin WHERE adminEmail = ? AND adminPassword = ?";
            db.query(adminQuery, [email, password], (adminErr, adminData) => {
                if (adminErr) return res.json({ error: true, message: 'Error querying database.' });
                if (adminData.length > 0) {
                    return res.json({ success: true, user: adminData[0] });
                }

                // No match found in any table
                return res.json({ success: false, message: 'Invalid email or password.' });
            });
        });
    });
});


// User signup
app.post('/sign-up', (req, res) => {
    const { donorName, donorEmail, donorPassword, donorDOB } = req.body;

    // Check if email already exists
    const checkEmailSql = "SELECT * FROM donor WHERE donorEmail = ?";

    db.query(checkEmailSql, [donorEmail], (err, data) => {
        if (err) {
            console.error('Error querying database:', err);
            return res.status(500).json({ success: false, message: 'Error checking email.' });
        }
        if (data.length > 0) {
            // Email already exists
            return res.status(400).json({ success: false, message: 'The email address already exists.' });
        }

        // If email does not exist, insert the new donor
        const sql = "INSERT INTO donor (donorName, donorEmail, donorPassword, donorDOB) VALUES (?, ?, ?, ?)";
        db.query(sql, [donorName, donorEmail, donorPassword, donorDOB], (err, data) => {
            if (err) {
                console.error('Error inserting data:', err);  // Log the error
                return res.status(500).json({ success: false, message: 'Error adding donor to database.' });
            }
            console.log('Data inserted successfully:', data);  // Log the success
            return res.status(200).json({
                success: true,
                message: 'Donor added successfully.',
            });
        });
    });
});


app.listen(8081, () => {
    console.log("listening");
});