const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'your_mysql_username',
  password: 'your_mysql_password',
  database: 'users_db',
});

connection.connect(function(err) {
  if (err) {
    console.error('Error connecting: ' + err.stack);
    return;
  }
  console.log('Connected as id ' + connection.threadId);
});

app.post('/register', function(req, res) {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  const query = `INSERT INTO users (name, email, password) VALUES ('${name}', '${email}', '${password}')`;

  connection.query(query, function(error, results, fields) {
    if (error) throw error;
    res.send('User registered successfully!');
  });
});

app.listen(3000, function() {
  console.log('Server is listening on port 3000!');
});
