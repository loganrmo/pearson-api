const mysql = require('mysql2');

const queryExecutor = (req, res, next) => {
    // If the connection is not created per request it throws a handshake error
    const con = mysql.createConnection({
        host: process.env.HOST,
        user: process.env.APP_USERNAME,
        password: process.env.APP_PASSWORD,
        database: process.env.DATABASE
    });

    sqlQuery = res.locals.sqlQuery;

    resultArray = []
    con.connect(function(err) {
        if (err) {
            console.error('QueryExecutorError: Error connecting to database');
            console.error(err);
            res.status(500);
            res.json({message: "Server Error"});
        }
        con.query(sqlQuery, function(err, result, fields) {
            if (err) {
                console.error('QueryExecutorError: Error executing query');
                console.error(err);
                res.status(500);
                res.json({message: "Server Error"});
            }
            // Returns array of objects, parse here
            len = result.length
            for (let i = 0; i < len; i++) {
                toPush = JSON.stringify(result[i]);
                delete toPush.id;
                resultArray.push(toPush);
            }
            res.set('Content-Type', 'application/json');
            res.status(200);
            res.json(resultArray);
            console.log(resultArray);
        });
    });
}

module.exports = queryExecutor;
