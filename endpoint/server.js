var express = require('express'),
    http = require('http'),
    mysql = require('mysql');

var app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

var connection = mysql.createConnection({
    host: '146.148.82.14',
    user: 'root',
    password: 'rebage2022',
    database: 'rebage_db',
});

connection.connect();

connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
    if (error) throw error;
    console.log(
        'The solution is: ',
        results[0].solution,
        ' database connetcted successfully!'
    );
});

app.set('port', process.env.PORT || 3000);

app.get('/', function (req, res) {
    res.send('MD Endpoint.');
});

// Signup API endpoint for user registration
app.post('/authentication/signup', async (req, res, next) => {
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;

    var query = 'INSERT INTO user (name, email, password) VALUES (?, ?, ?)';
    connection.query(query, [name, email, password], (err, result) => {
        if (err) {
            res.status(500).send('Internal Server Error');
        } else {
            res.status(200).send('User registered successfully');
        }
    });
});

// Login API endpoint for user login

// Other routes to check if the server is working properly
// Get all users
app.get('/alluser', function (req, res) {
    connection.query('SELECT * FROM user', function (err, rows) {
        if (err) {
            res.status(500).send('Internal Server Error');
        } else {
            res.status(200).send(rows);
        }
    });
});

// delete all user
app.delete('/deleteall', function (req, res) {
    connection.query('DELETE FROM user', function (err, result) {
        if (err) {
            res.status(500).send('Internal Server Error');
        } else {
            res.status(200).send('All user deleted successfully');
        }
    });
});

http.createServer(app).listen(app.get('port'), function () {
    console.log('Server: http://localhost:' + app.get('port'));
});
