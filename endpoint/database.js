var mysql = require('mysql');

var connection = mysql.createConnection({
    host: '146.148.82.14',
    user: 'root',
    password: 'rebage2022',
    database: 'rebage_db',
});

module.exports = connection;
