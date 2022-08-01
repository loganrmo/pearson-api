TABLES = {}

TABLES['arrivals'] = (
    "CREATE TABLE arrivals ("
    "id INT AUTO_INCREMENT PRIMARY KEY,"
    "flightCode VARCHAR(10) NOT NULL,"
    "flightDate DATE NOT NULL,"
    "city VARCHAR(30) NOT NULL,"
    "airportCode VARCHAR(4) NOT NULL,"
    "airlineName VARCHAR(25) NOT NULL,"
    "airlineCode VARCHAR(4) NOT NULL,"
    "scheduledTime TEXT NOT NULL,"
    "revisedTime TEXT,"
    "flightStatus TEXT NOT NULL"
    ") ENGINE=InnoDB"
)

TABLES['departures'] = (
    "CREATE TABLE departures ("
    "id INT AUTO_INCREMENT PRIMARY KEY,"
    "flightCode VARCHAR(10) NOT NULL,"
    "flightDate DATE NOT NULL,"
    "city VARCHAR(30) NOT NULL,"
    "airportCode VARCHAR(4) NOT NULL,"
    "airlineName VARCHAR(25) NOT NULL,"
    "airlineCode VARCHAR(4) NOT NULL,"
    "scheduledTime TEXT NOT NULL,"
    "revisedTime TEXT,"
    "flightStatus TEXT NOT NULL"
    ") ENGINE=InnoDB"
)

