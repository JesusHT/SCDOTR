import mysql.connector
from config.config import *

class MySQLConnection:
    def __init__(self):
        self.host     = HOST
        self.database = DB
        self.user     = USER
        self.password = PASSWORD
        self.charset  = CHARSET

        self.conexion = mysql.connector.connect(
            host     = self.host,
            user     = self.user,
            password = self.password,
            database = self.database,
            charset  = self.charset
        )

        self.cursor = self.conexion.cursor()

    def ejecutar_query(self, query, parametros=None):
        self.cursor.execute(query, parametros)
        self.conexion.commit()

    def obtener_registros(self, query, parametros=None):
        self.cursor.execute(query, parametros)
        return self.cursor.fetchall()

    def cerrar_conexion(self):
        self.cursor.close()
        self.conexion.close()