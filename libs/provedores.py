from libs.connection import MySQLConnection

class Proveedores:
    def __init__(self):
        self.conexion = MySQLConnection()

    def setProveedor(self, nombre_empresa, nombre_contacto, telefono, email):
        query = """
        INSERT INTO proveedor (nombre_empresa, nombre_contacto, telefono, email)
        VALUES (%s, %s, %s, %s)
        """
        parametros = (nombre_empresa, nombre_contacto, telefono, email)
        return self.conexion.ejecutar_sentencia(query, parametros)

    def updateProveedor(self, id_proveedor, nombre_empresa, nombre_contacto, telefono, email):
        query = """
        UPDATE proveedor SET nombre_empresa = %s, nombre_contacto = %s, telefono = %s, email = %s
        WHERE id = %s
        """
        parametros = (nombre_empresa, nombre_contacto, telefono, email, id_proveedor)
        return self.conexion.ejecutar_sentencia(query, parametros)

    def deleteProveedor(self, id_proveedor):
        query = """
        DELETE FROM proveedor
        WHERE id = %s
        """
        parametros = (id_proveedor,)
        return self.conexion.ejecutar_sentencia(query, parametros)

    def getProveedorByID(self, id_proveedor):
        query = """
        SELECT * FROM proveedor
        WHERE id = %s
        """
        parametros = (id_proveedor,)
        return self.conexion.obtener_registros(query, parametros)

    def getAllProveedores(self):
        query = """
        SELECT * FROM proveedor
        """
        return self.conexion.obtener_registros(query)
