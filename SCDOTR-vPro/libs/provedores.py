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
        return self.conexion.ejecutar_query(query, parametros)

    def updateProveedor(self, id_proveedor, nombre_empresa, nombre_contacto, telefono, email):
        query = """
        UPDATE proveedor SET nombre_empresa = %s, nombre_contacto = %s, telefono = %s, email = %s
        WHERE id = %s
        """
        parametros = (nombre_empresa, nombre_contacto, telefono, email, id_proveedor)
        self.conexion.ejecutar_query(query, parametros)

    def deleteProveedor(self, id_proveedor):
        query = """
        DELETE FROM proveedor
        WHERE id = %s
        """
        parametros = (id_proveedor,)
        return self.conexion.ejecutar_query(query, parametros)

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

    def countProductsUsingSupplierById(self, id_proveedor):
        query = """
        SELECT COUNT(*) FROM producto WHERE proveedor_id = %s
        """
        parametros = (id_proveedor,)
        return self.conexion.obtener_registros(query, parametros)

    def searchSupplier(self, params):
        search_str = f'%{params}%'
        
        query = """
            SELECT * FROM proveedor WHERE nombre_empresa LIKE %s OR nombre_contacto LIKE %s

        """ 

        parametros = (search_str, search_str)

        return self.conexion.obtener_registros(query, parametros)