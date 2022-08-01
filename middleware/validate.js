const val = require('../lib/validators');

const validate = (req, res, next) => {
    res.locals.queryValidity = {state: true, fields: []}

    function invalidateField(fieldName) {
        res.locals.queryValidity.state = false;
        res.locals.queryValidity.fields.push(fieldName);
    }

    try {
        if (res.locals.exists['flightCode']) {
            if (!val.validateFlightCode(res.locals.fields['flightCode'])) {
                invalidateField('flightCode');
            }
        }

        if (res.locals.exists['startDate'] && res.locals.exists['endDate']) {
            startDate = new Date(res.locals.fields.startDate);
            endDate = new Date(res.locals.fields.endDate);
            if (!val.validateDate(startDate, endDate)) {
                invalidateField('startDate');
                invalidateField('endDate');
            }
            res.locals.fields['startDate'] = startDate.toISOString().split('T')[0];
            res.locals.fields['endDate'] = endDate.toISOString().split('T')[0];
        } 

        if (res.locals.exists['airportCode']) {
            if (!val.validateAirportCode(res.locals.fields.airportCode)) {
                invalidateField('airportCode');
            }
        }

        if (res.locals.exists['airlineCode']) {
            if (!val.validateAirlineCode(res.locals.fields.airlineCode)) {
                invalidateField('airlineCode');
            }
        }

        if (res.locals.exists['scheduledTime']) {
            if (!val.validateTime(res.locals.fields.scheduledTime)) {
                invalidateField('scheduledTime');
            }
        }

        if (res.locals.exists['revisedTime']) {
            if (!val.validateTime(res.locals.fields.revisedTime)) {
                invalidateField('revisedTime');
            }
        }

        arrivalStatus = ['Arrived', 'Canceled', 'Delayed', 'Early', 'OnTime']
        departureStatus = ['Departed', 'Delayed', 'Canceled', 'OnTime']
        if (res.locals.exists['flightStatus']) {
            if (res.locals.pathway === 'arrivals') {
                statusArray = arrivalStatus;
            }
            if (res.locals.pathway === 'departures') {
                statusArray = departureStatus;
            }
            if (!val.validateStatus(res.locals.fields.flightStatus, statusArray)) {
                invalidateField('flightStatus');
            }
        }
    } catch(err) {
        console.error("ValidationError: Error validating fields");
        console.error(err);
        res.status(500);
        res.json({message: "Server Error"});
    }
    // console.log(res.locals.fields);
    // console.log(res.locals.exists);
    // console.log(res.locals.queryValidity);
    next();
}

module.exports = validate;
