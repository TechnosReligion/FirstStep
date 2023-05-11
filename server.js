const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const dbPath = path.resolve(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath);

app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
  db.run(query, [name, email, password], (err) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Failed to register user');
    } else {
      res.send('User registered successfully');
    }
  });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
  db.get(query, [email, password], (err, row) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Failed to authenticate user');
    } else if (!row) {
      res.status(401).send('Invalid email or password');
    } else {
      res.send(`Welcome, ${row.name}!`);
    }
  });
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});