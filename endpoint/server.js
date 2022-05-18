var express = require('express'),
    async = require('async'),
    http = require('http'),
    mysql = require('mysql');

var app = express();

var connection = mysql.createConnection({
    host: '146.148.82.14',
    user: 'root',
    password: '***',
    database: 'rebage_db',
});

connection.connect();

// Check if db connect
connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
    if (error) throw error;
    console.log('The solution is: ', results[0].solution, ' no error!');
});

app.set('port', process.env.PORT || 3000);

// Root page
app.get('/', function (res) {
    res.send('Root page');
});

// Post test
app.post('/', (req, res) => {
    res.send('POST request to homepage');
});

// Post a new user to the table user value (name, email, password)
app.post('/authentication/signup', (req, body, res, next) => {
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    var query = 'INSERT INTO user (name, email, password) VALUES (?, ?, ?)';
    connection.query(query, [name, email, password], (err, result) => {
        if (err) throw err;
        res.send('User added');
    });
});

// Get all users
app.get('/users', function (_req, res) {
    connection.query('SELECT * FROM user', function (err, rows) {
        if (err) throw err;
        res.send(rows);
    });
});

// Get user by id
app.get('/users/:id', function (req, res) {
    connection.query(
        'SELECT * FROM user WHERE id = ?',
        [req.params.id],
        function (err, rows) {
            if (err) throw err;
            res.send(rows);
        }
    );
});

// Add user to database hard coded
app.post('/add', function (req, res) {
    // generate random email
    var email = Math.random().toString(36).substring(7);

    // generate random name
    var name = Math.random().toString(36).substring(7);

    var query = 'INSERT INTO user (name, email, password) VALUES (?, ?, ?)';
    var values = [name, email, 'pass'];

    connection.query(query, values, function (err, result) {
        if (err) {
            console.log(err);
            res.send('Error');
        } else {
            res.send('Success');
        }
    });
});

// delete user by id
app.delete('/users/:id', function (req, res) {
    connection.query(
        'DELETE FROM user WHERE id = ?',
        [req.params.id],
        function (err, rows) {
            if (err) throw err;
            res.send(rows);
        }
    );
});

// delete all user
app.delete('/deleteall', function (req, res) {
    connection.query('DELETE FROM user', function (err, result) {
        if (err) {
            console.log(err);
            res.send('Error');
        } else {
            res.send('Success');
        }
    });
});

http.createServer(app).listen(app.get('port'), function () {
    console.log('Server: http://localhost:' + app.get('port'));
});
