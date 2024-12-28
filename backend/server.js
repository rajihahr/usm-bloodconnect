const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "test"
});

app.get('/', (req, res) => {
    return res.json('From backend side');
});

app.get('/users', (req, res) => {
    const sql = "SELECT * FROM users";
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
    db.query(sql, [email, password], (err, data) => {
        if (err) return res.json({ error: true, message: 'Error querying database.' });
        if (data.length > 0) {
            res.json({ success: true, user: data[0] });
        } else {
            res.json({ success: false, message: 'Invalid email or password.' });
        }
    });
});

app.listen(8081, () => {
    console.log("listening");
});