// Require mysql
var mysql = require('mysql');

// Create a connection
var connection = mysql.createConnection({
    host: '***',
    user: '***',
    password: '***',
    database: 'rebage_db',
});

// Export the connection
module.exports = connection;
