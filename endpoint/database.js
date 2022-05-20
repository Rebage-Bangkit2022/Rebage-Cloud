var mysql = require('mysql');

var connection = mysql.createConnection({
    host: '***',
    user: '***',
    password: '***',
    database: 'rebage_db',
});

module.exports = connection;
