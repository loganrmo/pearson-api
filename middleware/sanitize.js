const sanitize = (req, res, next) => {
    // Changes request object
    // Unescapes characters, and sanitizes input using regex
    // Potential array inputs include:
    // Arrays: airlineCode, airlineName, airportCode, flightCode, city, status, revisedTime, scheduledTime
    // DATES CANNOT BE ARRAYS
    function decodeAndReplace(field, regex) {
        if (res.locals.exists[`${field}`]) {
            res.locals.fields[`${field}`] = decodeURIComponent(res.locals.fields[`${field}`]).replace(regex, '');
        }
    }

    function arraySanitize(array, regex) {
        array = array.length;
        for (let i = 0; i < length; i++) {
            array[i] = decodeURIComponent(array[i]);
            array[i].replace(regex, '');
        }
        return array;
    }

    function decodeReplaceArray(field, regex) {
        if (res.locals.exists[`$field`]) {
            if (Array.isArray(res.locals.fields[`${field}`])) {
                arraySanitize(res.locals.fields[`${field}`], regex);
            } else {
                res.locals.fields[`${field}`] = decodeURIComponent(res.locals.fields[`${field}`])
                res.locals.fields[`${field}`].replace(regex, '');
            }
        }
    }

    try {
        decodeAndReplace('startDate', /[^0-9-]/gi);
        decodeAndReplace('endDate', /[^0-9-]/gi);
        decodeAndReplace('scheduledTime', /[^0-9 :,]/gi);
        decodeAndReplace('revisedTime', /[^0-9 :,]/gi);
    } catch(err) {
        console.error('SanitizationError: Error sanitizing fields: startDate, endDate, scheduledTime');
        console.error(err);
        res.status(500);
        res.json({message: "Server Error"});
    }

    try {
        decodeReplaceArray('flightCode', /[^a-z0-9,]/gi);
        decodeReplaceArray('city', /[^a-z0-9 -\(\),]/gi);
        decodeReplaceArray('airportCode', /[^a-z,]/gi);
        decodeReplaceArray('airlineName', /[^a-z0-9 -,]/gi);
        decodeReplaceArray('airlineCode', /[^a-z0-9,]/gi);
        decodeReplaceArray('status', /[^a-z,]/gi);
    } catch(err) {
        console.error('SanitizationError: Error sanitizing fields: flightCode, city, airportCode, airlineName, airlineCode, status');
        console.error(err);
        res.status(500);
        res.json({message: "Server Error"});
    }

    // Check and parse for arrays in fields
    try {
        const keys = Object.keys(res.locals.fields);
        keys.forEach(field => {
            if (res.locals.exists[`${field}`]) {
                if (res.locals.fields[`${field}`].includes(",")) {
                    res.locals.fields[`${field}`] = res.locals.fields[`${field}`].split(',');
                }
            }
        });
    } catch(err) {
        console.error('SanitizationError: Error parsing array fields');
        console.error(err);
        res.status(500);
        res.json({message: "Server Error"});
    }

    // Check path
    // console.log(req.path);
    let url = req.path.split('/').pop();
    if (url === 'arrivals') {
        res.locals.pathway = 'arrivals';
    } else if (url === 'departures') {
        res.locals.pathway = 'departures';
    } else {
        res.status(404);
        res.json({
            status: "Endpoint not found"
        });
    }
    // console.log(res.locals.pathway);
    next();
}

module.exports = sanitize;
