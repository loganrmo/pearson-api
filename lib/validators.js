function isAlpha(string) {
    len = string.length;
    for (let i = 0; i < len; i++) {
        if (!(/[a-zA-Z]/).test(string[i])) {
            return false;
        }
    }
    return true;
}

function validAirlineCode(string) {
    if (string.length !== 2) {
        return false;
    }
    string = string.trim()
    letterCount = 0;
    numCount = 0;
    for (let i = 0; i < 2; i++) {
        if (isAlpha(string[i])) {
            letterCount++;
        } else if (!isNaN(string[i])) {
            numCount++;
        }
    }
    if ((letterCount === 2 && numCount === 0) || (letterCount === 1 && numCount === 1)) {
        return true
    }
    return false
}

function validateFlightCode(flightCode) {
    if (Array.isArray(flightCode)) {
        arrayLength = flightCode.length
        for (let i = 0; i < arrayLength; i++) {
            length = flightCode[i].length
            if (!(flightCode[i].match(/^[a-z0-9]+$/i) && (length === 6 || length === 5))) {
                return false;
            } 
        }
    }        
    length = flightCode.length
    if (!(flightCode.match(/^[a-z0-9]+$/i) && (length === 6 || length === 5))) {
        return false;
    } 
    return true;
}


function validateDate(startDate, endDate) {
    if (!(startDate < endDate || startDate.toDateString() === endDate.toDateString())) {
        return false;
    }
    return true;
}

function validateAirportCode(airportCode) {
    // Check if fields are arrays
    if (Array.isArray(airportCode)) {
        length = airportCode.length;
        for (let i = 0; i < length; i++) {
            if (!(airportCode[i].length === 3 && isAlpha(airportCode[i]))) {
                return false;
            }
        }       
    }
    else {    
        if (!(airportCode.length === 3 && isAlpha(airportCode))) {
            return false;
        }
    }
    return true;
}

function validateAirlineCode(airlineCode) {
    if (Array.isArray(airlineCode)) {
        length = airlineCode.length
        for (let i = 0; i < length; i++) {
            if (!(validAirlineCode(airlineCode[i]))) {
                return false;
            }
        }
    }
    else {
        if (!(validAirlineCode(airlineCode))) {
            return false;
        }
    }
    return true;
}

function validateStatus(status, statusesArray) {
    if (Array.isArray(status)) {
        length = status.length;
        for (let i = 0; i < length; i++) {
            if (!(statusesArray.includes(status[i]))) {
                return false;
            }
        }       
    }
    else {
        // console.log(statusesArray.includes(status));
        // console.log(status);
        // console.log(typeof(status));
        // console.log(statusesArray);
        if (!(statusesArray.includes(status))) {
            return false;
        }
    }
    return true;
}

function validateTime(time) {
    if (Array.isArray(time)) {
        timesLength = time.length
        for (let i = 0; i < timesLength; i++) {
            individualTime = time[i].trim();
            result = /^([01][0-9]|2[0-3]):([0-5][0-9])$/.test(individualTime);
            if (!result) {
                return false;
            }
        }
        return true;
    } else {
        time = time.trim();
        return /^([01][0-9]|2[0-3]):([0-5][0-9])$/.test(time);
    }
}


module.exports = {
    validateFlightCode,
    validateAirlineCode,
    validateDate,
    validateAirportCode,
    validateAirlineCode,
    validateStatus,
    validateTime
};
