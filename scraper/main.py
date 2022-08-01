from scraper import scraper
from connectdb import cursor, db, DB_NAME
from tables import TABLES
import mysql.connector
from mysql.connector import errorcode
from datetime import datetime

# ADD ERROR HANDLING
def createDatabase():
    try:
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {DB_NAME} DEFAULT CHARACTER SET 'utf8'")
        print(f"Database {DB_NAME} created")
    except:
        print("FATAL ERROR: Cannot create database")
        raise SystemExit

def createTables():
    try:
        cursor.execute(f"USE {DB_NAME}")
    except:
        print("FATAL ERROR: Cannot use database")
        raise SystemExit
    for table in TABLES:
        tableValues = TABLES[table]
        try:
            print(f"Creating table {table}")
            cursor.execute(tableValues)
        except mysql.connector.Error as err:
            if err.errno == errorcode.ER_TABLE_EXISTS_ERROR:
                print(f"Table {table} already exists")
            else:
                print(err.msg)

def insertData(flights: list, tableName: str):
    for flight in flights:
        flightCode = flight['flightCode']
        city = flight['city'].replace("'", "")
        airportCode = flight['airportCode']
        airlineName = flight['airlineName'].replace("'", "")
        airlineCode = flight['airlineCode']
        scheduledTime = flight['scheduledTime']
        revisedTime = flight['revisedTime']
        flightStatus = flight['flightStatus']
 
        flightDate = datetime.today().strftime('%Y-%m-%d')
        if revisedTime == None:
            revisedTime == 'NULL'

        sql = (
            f"INSERT INTO {tableName}"
            "(flightCode, flightDate, city, airportCode, airlineName, airlineCode, scheduledTime, revisedTime, flightStatus)"
            "values"
            # "('F81225', '2022-07-26', 'Vancouver', 'YVR', 'Flair Airlines', 'F8', '00:05', '01:45', 'Arrived')"
            f"('{flightCode}', '{flightDate}', '{city}', '{airportCode}', '{airlineName}', '{airlineCode}', '{scheduledTime}', '{revisedTime}', '{flightStatus}');"
        )
        try:
            cursor.execute(sql)
            db.commit()
            print(f"Added flight {flightCode} for {flightDate}")
        except:
            print(f"FATAL ERROR: Cannot insert flights into table {tableName}")


def main():
    createDatabase()
    createTables()

    data = scraper()
    arrivals = data['arrivals']
    departures = data['departures']
    insertData(arrivals, 'arrivals')
    insertData(departures, 'departures')


if __name__ == "__main__":
    main()