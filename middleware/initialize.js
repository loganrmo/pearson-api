const initialize = (req, res, next) => {
    try {
        const fields = {flightCode: req.query.flightCode, 
            startDate: req.query.startDate, 
            endDate: req.query.endDate,
            city: req.query.city, 
            airportCode: req.query.airportCode, 
            airlineName: req.query.airlineName, 
            airlineCode: req.query.airlineCode, 
            scheduledTime: req.query.scheduledTime, 
            revisedTime: req.query.revisedTime, 
            flightStatus: req.query.flightStatus}

        const exists = {};
        const keys = Object.keys(fields);
        keys.forEach(field => {
            if (fields[`${field}`] == null) {
                exists[`${field}`] = false;
            }
            else {
                exists[`${field}`] = true;
            }
        });

        res.locals.fields = fields;
        res.locals.exists = exists;
    } catch(err) {
        console.error('InitializationError:')
        console.error(err);
        res.status(500);
        res.json({message: "Server Error"});
    }
    // console.log(res.locals.fields);
    // console.log(res.locals.exists);
    // console.log('Initialized...')
    next();
}

module.exports = initialize;