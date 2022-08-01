# Pearson API: Toronto Pearson International Airport API

Unofficial API that provides data about departures and arrivals at Toronto Pearson International Airport. Currently at version 1.0.0.

### Usage
An OpenAPI 3.0 Spec is included in the repository.

This API is queried using URL query parameters. Start with an endpoint, and build a query string such as the following:
`/api/arrivals?flightCode=AC756&city=San Francisco&airlineName=AirCanada`

Endpoints:
* `/api/arrivals?`: Information on arriving flights
* `/api/departures?`: Information on departing flights

Parameters: (No parameters are required)
* `startDate`: YYYY-MM-DD format date that indicates the date at which query should begin
* `endDate`: YYYY-MM-DD format date that indicates the date at which query should end
    * If you want one date, set both `startDate` and `endDate` to the same value
    * If one is present, both should be present
    * Currently, both values are required if one is present for security - in the future, a range option will be supported
* `city`: A string or array of strings denoting cities where flights have departed or arrived from
    * Example: `city=Vancouver`, `city=[Vancouver,San Francisco]`
* `airlineName`: A string or array of strings denoting airline name.
    * Example: `airlineName=[Air Canada,United Airlines]`, `airlineName=Air Canada`
* `flightCode`: Can be a string or an array of strings denoting the 6-digit flight code.
    * Example:  `flightCode=[AC756,AC757]`,  `flightCode=AC756`
* `airlineCode`: IATA airline code, either two letters or a letter and a number. Can be a string or array of strings.
    * Example: `airlineCode=[AC,UA]`, `airlineCode=AC`
* `airportCode`: IATA airport code, three letters. Can be a string or array of strings.
    * Example: `airportCode=[YYC,YVR]`, `airportCode=YYC`
* `scheduledTime`: Twenty four hour `HH:MM` time flight(s) were initially scheduled for. Can be individual or an array of times.
    * Example: `scheduledTime=[12:00, 17:12]`, `scheduledTime=12:00`
* `revisedTime`: Twenty four hour `HH:MM`revised time for flight(s). Can be individual or an array of times.
    * Example: `revisedTime=[12:00, 17:12]`, `revisedTime=12:00`
* `flightStatus`: Status for flights queried. Can be a string value or an array of strings from the following schema depending on whether querying for departures or arrivals.
    * Schema/Potential Values: 
        * Departures: `Departed`, `Delayed`, `Canceled`, `OnTime` 
        * Arrivals: `Arrived`, `Canceled`, `Delayed`, `Early`, `OnTime`
    * Example: `flightStatus=OnTime`, `flightStatus=[OnTime,Canceled]`

Notes:
* Strings should not be wrapped in quotes
* Arrays should not have spaces between items

Responses:
* `200`: OK
* `400`: Bad Request - JSON returned will include which fields were improperly formatted
* `404`: Invalid Endpoint
* `500`: Server Error

### About
As a developer and security engineer, I kept web security and systems security principles in mind during the entire development process. This was a hobby project that I wanted to use to learn about not only backend development and API design, but also API security and Secure Software Development. This repository is also stored on my HomeLab, where I am working on creating a CI/CD pipeline with SAST, DAST, secret scanning, and SCA/SBOM functionality.

### Architecture
The application consists of three parts:
* API gateway and endpoints
* SQL Database
* Web scraping service

The API gateway and endpoints are written in Node.js with Express.js. All sanitizing, querying, and validation is done on the server side (and written from scratch as a security exercise). The API can be queried and it retrieves information from the MySQL database. The MySQL database is updated once daily by the web scraping service, a tool I wrote in Python that scrapes the Pearson website.

Each service is Dockerized and hardened, with `docker-compose` currently being used for orchestration. Secrets and credentials are managed through environment variables and the principle of least privilege is followed on all service accounts.

In addition, an OpenAPI 3.0 spec is included. 
