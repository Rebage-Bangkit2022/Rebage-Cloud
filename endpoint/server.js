// Require module
var express = require('express'),
    http = require('http'),
    bcrypt = require('bcrypt'),
    session = require('express-session'),
    passport = require('passport'),
    bodyParser = require('body-parser');

// Google Auth required
require('./config/auth');

// MySQL required
var connection = require('./config/database');

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
    res.render('index');
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
    res.send(
        `Welcome to the protected page, ${req.user.name}!<br />
        your email is: ${req.user.email}<br />
        your id is: ${req.user.id}<br />
        your avatar is: <br />
        <img src="${req.user.avatar}" /><br />
        <a href="/signout">Signout</a>`
    );
});

// Google failure
app.get('/auth/google/failure', (req, res) => {
    res.send('Failed to authenticate <br><a href="/">Go to Homepage</a>');
});

// Regular Authentication
// Check if the user is logged in
function isLoggedIn(req, res, next) {
    if (req.session.user) return next();
    res.redirect('/login');
}

// Regular registration
app.get('/register', function (req, res) {
    // Check if the user is logged in
    if (req.session.user) return res.redirect('/dashboard');
    res.render('register');
});

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
                res.send('User already exists');
            } else {
                // Hash the password
                bcrypt.hash(password, 10, function (err, hash) {
                    // Insert the user
                    connection.query(
                        'INSERT INTO user (name, email, password) VALUES (?, ?, ?)',
                        [name, email, hash],
                        function (error, results, fields) {
                            if (error) throw error;
                            res.send(
                                `User created successfully<br />
                                <a href="/">Go to Homepage</a><br />
                                <a href="/login">Login</a>`
                            );
                        }
                    );
                });
            }
        }
    );
});

// Regular login
app.get('/login', function (req, res) {
    // Check if the user is logged in
    if (req.session.user) return res.redirect('/dashboard');
    res.render('login');
});

app.post('/login', function (req, res) {
    // Body request
    var email = req.body.email;
    var password = req.body.password;

    // Check if the user exists
    connection.query(
        'SELECT * FROM user WHERE email = ?',
        [email],
        function (error, results, fields) {
            if (error) throw error;
            if (results.length > 0) {
                // Check if the password is correct
                bcrypt.compare(
                    password,
                    results[0].password,
                    function (err, isMatch) {
                        if (isMatch) {
                            // Create the session
                            req.session.user = results[0];
                            res.redirect('/dashboard');
                        } else {
                            res.send('Wrong password');
                        }
                    }
                );
            } else {
                res.send('User does not exist');
            }
        }
    );
});

// Protected dashboard
app.get('/dashboard', isLoggedIn, (req, res) => {
    // check if the user is logged in
    if (req.session.user) {
        res.send(
            `Welcome to the dashboard, ${req.session.user.name}!<br />
            <a href="/signout">Signout</a><br />
            <a href="/fav">Artikel Favorit</a><br />
            <a href="/">Go to Homepage as Loggedin</a>`
        );
    } else {
        res.send(
            `You are not logged in,<br />
            <a href="/login">Login</a>`
        );
    }
});

// Regular signout
app.get('/signout', function (req, res) {
    req.session.destroy();
    res.send(`Good Bye! <br><a href="/">Go to Homepage</a>`);
});

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

// delete all user get
app.get('/deletealluser', function (req, res) {
    res.send(
        'Are you sure you want to delete all users?<br />' +
            '<a href="/deletealluser/yes">Yes</a> | <a href="/">No</a>'
    );
});

app.get('/deletealluser/yes', function (req, res) {
    connection.query('DELETE FROM user', function (err, rows) {
        if (err) {
            res.status(500).send('Internal Server Error');
        } else {
            res.status(200).send('All user deleted');
        }
    });
});

// Get barang information
app.get('/barang', function (req, res) {
    connection.query(
        'SELECT id, barang, harga FROM barang',
        function (err, rows) {
            if (err) {
                res.status(500).send('Internal Server Error');
            } else {
                res.status(200).send(rows);
            }
        }
    );
});

// Get image barang
app.get('/barang/image', function (req, res) {
    connection.query('SELECT gambar FROM barang', function (err, rows) {
        if (err) {
            res.status(500).send('Internal Server Error');
        } else {
            res.status(200).send(
                `
                ${rows[0].gambar} <br />
                ${rows[1].gambar} <br />
                ${rows[2].gambar} <br />
                ${rows[3].gambar} <br />
                ${rows[4].gambar} <br />
                ${rows[5].gambar} <br />
                ${rows[6].gambar} <br />
                ${rows[7].gambar} <br />
                `
            );
        }
    });
});

// Get artikel reduce information
app.get('/artikel/reduce', function (req, res) {
    connection.query('SELECT * FROM artikel_reduce', function (err, rows) {
        if (err) {
            res.status(500).send('Internal Server Error');
        } else {
            res.status(200).send(rows);
        }
    });
});

// Get image artikel reduce
app.get('/artikel/reduce/image', function (req, res) {
    connection.query('SELECT gambar FROM artikel_reduce', function (err, rows) {
        if (err) {
            res.status(500).send('Internal Server Error');
        } else {
            res.status(200).send(
                `
                ${rows[0].gambar}
                `
            );
        }
    });
});

// Get artikel reuse information
app.get('/artikel/reuse', function (req, res) {
    connection.query('SELECT * FROM artikel_reuse', function (err, rows) {
        if (err) {
            res.status(500).send('Internal Server Error');
        } else {
            res.status(200).send(rows);
        }
    });
});

// Get image artikel reuse
app.get('/artikel/reuse/image', function (req, res) {
    connection.query('SELECT gambar FROM artikel_reuse', function (err, rows) {
        if (err) {
            res.status(500).send('Internal Server Error');
        } else {
            res.status(200).send(
                `
                ${rows[0].gambar}
                `
            );
        }
    });
});

// Add artikel to user logged in favourited list w/ GET
app.get('/addfav/:id', function (req, res) {
    // Check if the user is logged in
    if (req.session.user) {
        //  If user already favourited the artikel, return error
        connection.query(
            'SELECT * FROM artikel_favorit WHERE id_user = ? AND id_artikel = ?',
            [req.session.user.id, req.params.id],
            function (err, rows) {
                if (err) {
                    res.status(500).send('Internal Server Error');
                } else {
                    if (rows.length > 0) {
                        res.send('You already favourited this artikel');
                    } else {
                        //  If user not favourited the artikel, add it to the list
                        connection.query(
                            'INSERT INTO artikel_favorit (id_user, id_artikel) VALUES (?, ?)',
                            [req.session.user.id, req.params.id],
                            function (err, rows) {
                                if (err) {
                                    res.status(500).send(
                                        'Internal Server Error'
                                    );
                                } else {
                                    res.send(
                                        'Artikel added to your favourited list'
                                    );
                                }
                            }
                        );
                    }
                }
            }
        );
    } else {
        res.send('You are not logged in');
    }
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
                    res.status(500).send('Internal Server Error');
                } else {
                    if (rows.length > 0) {
                        res.send('You already favourited this artikel');
                    } else {
                        //  If user not favourited the artikel, add it to the list
                        connection.query(
                            'INSERT INTO artikel_favorit (id_user, id_artikel) VALUES (?, ?)',
                            [req.session.user.id, req.body.id],
                            function (err, rows) {
                                if (err) {
                                    res.status(500).send(
                                        'Internal Server Error'
                                    );
                                } else {
                                    res.send(
                                        'Artikel added to your favourited list'
                                    );
                                }
                            }
                        );
                    }
                }
            }
        );
    } else {
        res.send('You are not logged in');
    }
});

// Print loggedin user with favourite artikel Natural Join
app.get('/fav', function (req, res) {
    // Check if the user is logged in
    if (req.session.user) {
        connection.query(
            'SELECT user.id, artikel_favorit.id_artikel FROM user INNER JOIN artikel_favorit ON user.id=artikel_favorit.id_user;',
            function (err, rows) {
                if (err) {
                    res.status(500).send('Internal Server Error');
                } else {
                    res.status(200).send(rows);
                }
            }
        );
    } else {
        res.send('You are not logged in');
    }
});

// Creating the server
http.createServer(app).listen(app.get('port'), function () {
    console.log('Listening to ' + app.get('port'));
});
