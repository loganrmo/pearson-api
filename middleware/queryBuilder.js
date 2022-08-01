const con = require('./database');

const queryBuilder = (req, res, next) => {
    const keys = Object.keys(res.locals.fields);
    let paramCount = 0;
    let params = [];
    
    keys.forEach(field => {
        if (res.locals.exists[`${field}`]) {
            paramCount++;
        }
    });

    if (paramCount === 0) {
        params.push(`SELECT * FROM ${res.locals.pathway} `);
    } else {
        params.push(`SELECT * FROM ${res.locals.pathway} WHERE `);
    }
    
    try {
        // Date, cannot be array, has special clause - escaping date formats it weirdly
        if (res.locals.exists['startDate'] && res.locals.exists['endDate']) {
            if (paramCount > 2) {
                clause = 'flightDate BETWEEN ' + con.escape(startDate).slice(0, -14) + "'" + ' AND ' + con.escape(endDate).slice(0, -14) + "'" + ' AND ';
            } else {
                clause = 'flightDate BETWEEN ' + con.escape(startDate).slice(0, -14) + "'" + ' AND ' + con.escape(endDate).slice(0, -14) + "'";
            }
            params.push(clause);
        }

        let ctr = 0;
        keys.forEach(field => {
            if (res.locals.exists[`${field}`]) {
                ctr++;
                let andSwitch = true;
                if (ctr === paramCount) {
                    andSwitch = false;
                }
                let clause = ''
                if (field === 'startDate' || field === 'endDate') {
                    return;
                }
                // Escaping it stops it from being an array
                let fieldValue = con.escape(res.locals.fields[`${field}`]);
                clause = `${field} IN (${fieldValue})`;
                if (andSwitch) {
                    clause = clause + ' AND ';
                }
                params.push(clause);
            }
        });
        // Build query
        sqlQuery = ''
        params.forEach(param => {
            sqlQuery = sqlQuery + param;
        });
        // console.log(params);
        // console.log(sql.Query);
        res.locals.sqlQuery = sqlQuery;
        
    } catch(err) {
        console.error("QueryBuildError: Error building query");
        console.error(err);
        res.status(500);
        res.json({message: "Server Error"});
    }
    
    next()
}


module.exports = queryBuilder;

//http://localhost:5000/api/arrivals?startDate=2002-10-17&endDate=2002-10-19&flightCode=AC6473&airportCode=YYZ,YYC&airlineCode=AC&scheduledTime=22:00&revisedTime=22:25,22:40&flightStatus=OnTime
// http://localhost:5000/api/arrivals?startDate=2002-10-17&endDate=2002-10-19&flightCode=AC6473&airportCode=YYZ,YYC&airlineCode=AC&scheduledTime=22:00&revisedTime=22:25,22:40&flightStatus=OnTime&city=San%20Salvador%20(San%20Luis%20Potosi)&airlineName=Air%20Canada     
// http://localhost:5000/api/arrivals?startDate=2022-07-25&endDate=2022-07-27&city=Vancouver&airportCode=YVR&airlineName=Flair Airlines&airlineCode=F8&scheduledTime=00:05&revisedTime=01:45&flightStatus=Arrived
