import mysql.connector
import os
from dotenv import load_dotenv

try:
    load_dotenv('.env') 
    USER = os.environ.get("USER")
    PASSWORD = os.environ.get("PASSWORD")
    HOST = os.environ.get("HOST")
    DB_NAME = os.environ.get("DB_NAME")
except:
    print('FATAL ERROR: Cannot retrieve credentials to connect to database')
    raise SystemExit

config = {
    'user': USER,
    'password': PASSWORD,
    'host': HOST
}

db = mysql.connector.connect(**config)
cursor = db.cursor()
