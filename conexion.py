import mysql.connector

def conectar():
    return mysql.connector.connect(
      host="localhost",
      user="root",
      password="12015",
      database="jadarbank"
)