import requests
from bs4 import BeautifulSoup


def scrapePage(url: str) -> list:
    '''
    Returns a list of strings containing flight information from the Pearson Airport website
    '''
    try:
        page = requests.get(url)
    except:
        print('Error: Cannot get given Pearson URL')
        return None
    soup = BeautifulSoup(page.content, 'html.parser')
    table = soup.find_all("tr", class_ = None)
    for row in range(len(table)):
        table[row] = table[row].text
    return table


def parser(table: list) -> list:
    '''
    Takes in a list of strings containing flight information and returns a list of dictionaries about each flight
    '''
    flights = []

    def cleanRow(row):
        while ('' in row):
            row.remove('')
        while('\n\n' in row):
            row.remove('\n\n')
 
    for row in table:
        rowReference = row # Used for error messages
        city, airportCode, airlineCode, airlineName, flightCode, scheduledTime, revisedTime, flightStatus = None, None, None, None, None, None, None, None
        row = row.split(' ')
        cleanRow(row)

        # Time and Status
        try:
            if 'Time' in row[-1]:
                row[-1] = 'OnTime'
                row.remove(row[-2])
            flightStatus = row[-1]
            revisedTime = row[-2]
            scheduledTime = row[-3]
            row.remove(flightStatus)
            row.remove(revisedTime)
            row.remove(scheduledTime)
            if revisedTime == '-':
                revisedTime = None
        except:
            print(f'Error: Cannot parse times and status for flight {rowReference}')
            continue
        # Get airport code and remove from list
        try:
            toParse = row[-1]
            # Codes: AirlinesAC123, AirlinesA2345, AIRLINESAC1233, AIRLINESA1233
            for l in range(1, len(toParse)):
                if toParse[l].isnumeric() and toParse[l - 1].isupper():
                    if toParse[l - 2].isupper():
                        flightCode = toParse[l - 2:]
                        row[-1] = toParse[:l - 2]
                    else:
                        flightCode = toParse[l - 1:]
                        row[-1] = toParse[:l - 1]

                    break
                # if toParse[l].isupper() and (toParse[l + 1].isupper() or toParse[l + 1].isnumeric()):
                #     flightCode = toParse[l:]
                #     row[-1] = toParse[:l]
                #     break
        except:
            print(f'Error: Cannot parse airport code for flight {rowReference}')
            continue

        # Concatenate airline name based on positioning
        try:
            airlineName = ''
            brackets = False
            for i in range(len(row)):
                if ('(' and ')') in row[i] and ('(' and ')') not in row[i + 1]:
                    brackets = True
                    continue
                if brackets:
                    airlineName = airlineName + ' ' + row[i]
                    row[i] = ''
            airlineName = airlineName.strip()
            cleanRow(row)
        except:
            print(f'Error: Cannot parse airline name for flight {rowReference}')
            continue

        try:
            # Pop airline code and airport code
            airlineCode = row.pop().strip('(').strip(')')
            airportCode = row.pop().strip('(').strip(')')
            # Remaining elements are location name
            city = ''
            for element in row:
                city = city + ' ' + element
            city = city.strip()
        except:
            print(f'Error: Cannot parse airline/airport code and city for flight {rowReference}')
            continue

        # Create a dictionary with flight information
        flight = {
            'flightCode': flightCode,
            "city": city,
            'airportCode': airportCode,
            'airlineName': airlineName,
            'airlineCode': airlineCode,
            'scheduledTime': scheduledTime,
            'revisedTime': revisedTime,
            'flightStatus': flightStatus
        }
        # Add to list of flights
        flights.append(flight)
    return flights


def scraper() -> dict:
    '''
    Main function that scrapes and parses for both arrivals and departures, returning both in the aforementioned order
    To use both: arrivals, departures = scraper()
    '''
    arrivalsURL = 'https://www.toronto-pearson-airport.com/pearson-arrivals.php'
    departuresURL = 'https://www.toronto-pearson-airport.com/pearson-departures.php'
    arrivalsTable = scrapePage(arrivalsURL)
    departuresTable = scrapePage(departuresURL)
    try:
        arrivals = parser(arrivalsTable)
        departures = parser(departuresTable)
    except:
        print('Error: Cannot fetch arrivals or departures.')
    dataset = {
        "arrivals": arrivals,
        "departures": departures
    }
    return dataset

if __name__ == "__main__":
    data = scraper()
    arrivals = data['arrivals']
    departures = data['departures']
    print(arrivals)
    print(departures)

# TESTING ---
    #row = 'Kelowna (YLW) (WO) SWOOP AIRLINESWO316  00:20 23:54 Arrived    \n\n'
    #row = 'Ottawa (YOW) (AC) Air CanadaAC474  00:30 01:01 Departed    \n\n'
    #row = 'Washington (DCA) (AC) Air Canada JazzAC8780  07:15 - Canceled    \n\n'
    #row = 'San Salvador (San Luis Talpa) (SAL) (AV) Avianca AirlinesAV627  17:15 16:59 Departed    \n\n'
    #row = 'Ponta Delgada (PDL) (S4) Azores AirlinesS4322  20:50 20:50 On Time    \n\n'
    # print(flightCode, city, airportCode, airlineName, airlineCode, scheduledTime, revisedTime, status)
