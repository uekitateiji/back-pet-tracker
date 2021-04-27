const mysql = require('mysql');

var pool = mysql.createPool({
    "user": "b59747c61ba7ff",
    "password": "79d9be4b",
    "database": "heroku_296a3f94ab9113d",
    "host": "us-cdbr-east-03.cleardb.com",
    "port": 3306
});

exports.pool = pool;