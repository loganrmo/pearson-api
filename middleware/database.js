const mysql = require('mysql2');

const con = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.APP_USERNAME,
    password: process.env.APP_PASSWORD,
    database: process.env.DATABASE
});

con.connect(function(err) {
    if (err) {
        console.log('DatabaseError: Cannot connect to database');
        throw err;
    }
    console.log("Connected to database");
});

module.exports = con;
