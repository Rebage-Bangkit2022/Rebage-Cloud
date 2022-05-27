// Express JWT
const express = require('express');
const http = require('http');
const app = express();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const conn = require('../config/database');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set('port', process.env.PORT || 3000);

conn.connect(function (err) {
    if (err) throw err;
    console.log('Database connected!');
});

// Root
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the API',
    });
});

// Register
app.post('/register', (req, res) => {
    const data = req.body;
    // Check the user is already registered
    conn.query(
        'SELECT * FROM user WHERE email = ?',
        [data.email],
        (err, result) => {
            if (err) throw err;
            if (result.length > 0) {
                res.json({
                    status: 400,
                    message: 'User already registered',
                });
            } else {
                // Hash the password
                bcrypt.hash(data.password, 10, (err, hash) => {
                    if (err) throw err;
                    // Insert the user
                    conn.query(
                        'INSERT INTO user (name, email, password) VALUES (?, ?, ?)',
                        [data.name, data.email, hash],
                        (err, result) => {
                            if (err) throw err;
                            res.json({
                                status: 200,
                                message: 'User registered',
                            });
                        }
                    );
                });
            }
        }
    );
});

// Login
app.post('/login', (req, res) => {
    const data = req.body;
    const sql = `SELECT * FROM user WHERE email = '${data.email}'`;
    conn.query(sql, (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            const hash = result[0].password;
            if (bcrypt.compareSync(data.password, hash)) {
                const token = jwt.sign(
                    {
                        email: result[0].email,
                        id: result[0].id,
                    },
                    'secret',
                    { expiresIn: '24h' }
                );
                res.json({
                    status: 200,
                    message: 'Successfully logged in',
                    token,
                });
            } else {
                res.json({
                    status: 403,
                    message: 'Wrong credentials',
                });
            }
        } else {
            res.json({
                status: 403,
                message: 'Wrong credentials',
            });
        }
    });
});

// Verify Token
function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.json({
            status: 403,
            message: 'Forbidden',
        });
    }
}

// User
app.get('/user', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secret', (err, authData) => {
        if (err) {
            res.json({
                status: 403,
                message: 'Forbidden',
            });
        } else {
            res.json({
                status: 200,
                message: 'Successfully logged in',
                authData,
            });
        }
    });
});

http.createServer(app).listen(app.get('port'), () => {
    console.log('Server is running on port ' + app.get('port'));
});
