// Require module
var express = require('express'),
    http = require('http'),
    bcrypt = require('bcrypt'),
    session = require('express-session'),
    passport = require('passport'),
    bodyParser = require('body-parser');

// Google Auth required
require('../config/auth');

// MySQL required
var connection = require('../config/database');

// The app express
var app = express();

// Middleware
// Express session
app.use(
    session({
        secret: 'rebage',
        resave: false,
        saveUninitialized: true,
    })
);
// Parsing the body
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
// Using passport
app.use(passport.initialize());
app.use(passport.session());
// Parsing the JSON
app.use(express.json());
app.use(bodyParser.json());
// App port
app.set('port', process.env.PORT || 3000);
// Trust proxy
app.set('trust proxy', true);
// View engine ejs
app.set('view engine', 'ejs');

// Connect and check the database
connection.connect();
connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
    if (error) throw error;
    console.log(
        'The solution is: ',
        results[0].solution,
        ' database connetcted successfully!'
    );
});

// Root path
app.get('/', function (req, res) {
    res.json({
        message: 'Welcome to Rebage API',
    });
});

// Google Authentication
// Check if the user is logged in
function isAuthWithGoogle(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/auth/google');
}

// Google login
app.get(
    '/auth/google',
    passport.authenticate('google', { scope: ['email', 'profile'] })
);

// Google callback
app.get(
    '/auth/google/callback',
    passport.authenticate('google', {
        successRedirect: '/protected',
        failureRedirect: '/auth/google/failure',
    })
);

// Google protected
app.get('/protected', isAuthWithGoogle, (req, res) => {
    // Save user to database
    connection.query(
        'INSERT INTO user (name, email, id_google) VALUES (?, ?, ?)',
        [req.user.name, req.user.email, req.user.id],
        // Check if the user is already in the database
        function (error, results, fields) {
            if (error) {
                if (error.code === 'ER_DUP_ENTRY') {
                } else {
                    throw error;
                }
            }
        }
    );

    res.json({
        name: req.user.name,
        email: req.user.email,
        avatar: req.user.avatar,
    });
});

// Google failure
app.get('/auth/google/failure', (req, res) => {
    res.json({
        message: 'Google authentication failed',
    });
});

// Regular Authentication
// Check if the user is logged in
function isLoggedIn(req, res, next) {
    if (req.session.user) return next();
    res.json({
        message: 'You are not logged in',
    });
}

app.post('/register', function (req, res) {
    // Body request
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;

    // Check if the user already exists
    connection.query(
        'SELECT * FROM user WHERE email = ?',
        [email],
        function (error, results, fields) {
            if (error) throw error;
            if (results.length > 0) {
                res.json({
                    message: 'User already exists',
                });
            } else {
                // Hash the password
                bcrypt.hash(password, 10, function (err, hash) {
                    // Insert the user
                    connection.query(
                        'INSERT INTO user (name, email, password) VALUES (?, ?, ?)',
                        [name, email, hash],
                        function (error, results, fields) {
                            if (error) throw error;
                            res.json({
                                message: 'User created successfully',
                            });
                        }
                    );
                });
            }
        }
    );
});

// Regular login
app.post('/login', function (req, res) {
    // Body request
    var email = req.body.email;
    var password = req.body.password;

    // Check user with id_google
    connection.query(
        'SELECT * FROM user WHERE email = ?',
        [email],
        function (error, results, fields) {
            if (error) throw error;
            if (results.length > 0) {
                // Check the id_google
                if (results[0].id_google) {
                    res.json({
                        message: 'User already logged in with Google',
                    });
                } else {
                    // Check the password
                    bcrypt.compare(
                        password,
                        results[0].password,
                        function (err, result) {
                            if (result) {
                                // Save user to session
                                req.session.user = {
                                    id: results[0].id,
                                    name: results[0].name,
                                    email: results[0].email,
                                };
                                res.json({
                                    message: 'User logged in successfully',
                                });
                            } else {
                                res.json({
                                    message: 'Wrong password',
                                });
                            }
                        }
                    );
                }
            } else {
                res.json({
                    message: 'User not found',
                });
            }
        }
    );
});

// Edit user
app.post('/edit', isLoggedIn, function (req, res) {
    // Body request
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;

    // Check if the user is logged in
    if (!req.session.user) return res.json({ message: 'User not logged in' });

    // Hash the password
    bcrypt.hash(password, 10, function (err, hash) {
        // Update the user
        connection.query(
            'UPDATE user SET name = ?, email = ?, password = ? WHERE id = ?',
            [name, email, hash, req.session.user.id],
            function (error, results, fields) {
                if (error) throw error;
                res.json({
                    message: 'User updated successfully',
                });
            }
        );
    });
});

// Protected dashboard
app.get('/dashboard', isLoggedIn, (req, res) => {
    // check if the user is logged in
    if (req.session.user) {
        res.json({
            message: 'Welcome to your dashboard',
        });
    } else {
        res.json({
            message: 'You are not logged in',
        });
    }
});

// Regular signout
app.get('/signout', function (req, res) {
    req.session.destroy();
    res.json({
        message: 'User logged out successfully',
    });
});

// Other routes to check if the server is working properly
// Get all users
app.get('/alluser', function (req, res) {
    connection.query('SELECT * FROM user', function (err, rows) {
        if (err) {
            res.status(500).json({
                error: err,
            });
        } else {
            res.status(200).json(rows);
        }
    });
});

// delete all user get
app.get('/deletealluser', function (req, res) {
    connection.query('DELETE FROM user', function (err, rows) {
        if (err) {
            res.status(500).json({
                error: err,
            });
        } else {
            res.status(200).json({
                message: 'All user deleted',
            });
        }
    });
});

// Get barang information
app.get('/barang', function (req, res) {
    connection.query('SELECT * FROM barang', function (err, rows) {
        if (err) {
            res.status(500).json({
                error: err,
            });
        } else {
            res.status(200).json(rows);
        }
    });
});

// Get artikel reduce information
app.get('/artikel/reduce', function (req, res) {
    connection.query('SELECT * FROM artikel_reduce', function (err, rows) {
        if (err) {
            res.status(500).json({
                error: err,
            });
        } else {
            res.status(200).json(rows);
        }
    });
});

// Get artikel reuse information
app.get('/artikel/reuse', function (req, res) {
    connection.query('SELECT * FROM artikel_reuse', function (err, rows) {
        if (err) {
            res.status(500).json({
                error: err,
            });
        } else {
            res.status(200).json(rows);
        }
    });
});

// Add artikel to user logged in favourited list w/ POST
app.post('/addfav', function (req, res) {
    // Check if the user is logged in
    if (req.session.user) {
        //  If user already favourited the artikel, return error
        connection.query(
            'SELECT * FROM artikel_favorit WHERE id_user = ? AND id_artikel = ?',
            [req.session.user.id, req.body.id],
            function (err, rows) {
                if (err) {
                    res.status(500).json({
                        error: err,
                    });
                } else {
                    if (rows.length > 0) {
                        res.json({
                            message: 'Artikel already favourited',
                        });
                    } else {
                        //  If user not favourited the artikel, add it to the list
                        connection.query(
                            'INSERT INTO artikel_favorit (id_user, id_artikel) VALUES (?, ?)',
                            [req.session.user.id, req.body.id],
                            function (err, rows) {
                                if (err) {
                                    res.status(500).json({
                                        error: err,
                                    });
                                } else {
                                    res.json({
                                        message:
                                            'Artikel added to your favourite list',
                                    });
                                }
                            }
                        );
                    }
                }
            }
        );
    } else {
        res.json({
            message: 'You are not logged in',
        });
    }
});

// Print loggedin user with favourite artikel Natural Join
app.get('/fav', function (req, res) {
    // Check if the user is logged in
    if (req.session.user) {
        connection.query(
            'SELECT user.id, artikel_favorit.id_artikel FROM user INNER JOIN artikel_favorit ON user.id=artikel_favorit.id_user WHERE user.id = ?;',
            [req.session.user.id],
            function (err, rows) {
                if (err) {
                    res.status(500).json({
                        error: err,
                    });
                } else {
                    res.status(200).json(rows);
                }
            }
        );
    } else {
        res.json({
            message: 'You are not logged in',
        });
    }
});

// Creating the server
http.createServer(app).listen(app.get('port'), function () {
    console.log('Listening to ' + app.get('port'));
});
