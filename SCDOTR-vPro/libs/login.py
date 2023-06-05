from flask import session
from libs.connection import MySQLConnection

class Login:
    def __init__(self, username, password):
        self.username = username
        self.password = password
        self.role = None

    def validate_user(self):
        query = "SELECT role FROM users WHERE username=%s AND password=%s"
        connection = MySQLConnection()
        user = connection.obtener_registros(query, (self.username, self.password))
        connection.cerrar_conexion()
        if user:
            self.role = user[0][0]
            session['username'] = self.username
            session['role']     = self.role
            return self.role
        return False