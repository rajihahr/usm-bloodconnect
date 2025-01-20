const mysql = require("mysql");
require("dotenv").config(); // Load environment variables

const db = mysql.createPool({
    connectionLimit: process.env.DB_CONNECTION_LIMIT || 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

function handleDisconnect() {
    db.getConnection((err, connection) => {
        if (err) {
            console.error("Error connecting to database:", err);
            setTimeout(handleDisconnect, 2000); // Retry after 2 seconds
        } else {
            console.log("Connected to database");
            if (connection) connection.release();
        }
    });
}

handleDisconnect();
module.exports = db;