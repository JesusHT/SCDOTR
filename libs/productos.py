from libs.connection import MySQLConnection

class Productos:
    def __init__(self):
        self.conexion = MySQLConnection()

    def setProduct(self, nombre, descripcion, precio, proveedor_id, total_producto):
        query = """
        INSERT INTO producto (nombre, descripcion, precio, proveedor_id, totalProducto)
        VALUES (%s, %s, %s, %s, %s)
        """
        parametros = (nombre, descripcion, precio, proveedor_id, total_producto)
        self.conexion.ejecutar_query(query, parametros)

    def getProduct(self):
        query = """
        SELECT producto.*, proveedor.nombre_empresa AS nombre_proveedor  
        FROM producto
        JOIN proveedor ON producto.proveedor_id = proveedor.id;

        """
        return self.conexion.obtener_registros(query)

    def getProductByID(self, id_producto):
        query = """
        SELECT * FROM producto
        WHERE id = %s
        """
        parametros = (id_producto,)

        return self.conexion.obtener_registros(query, parametros)

    def updateProduct(self, id_producto, nombre, descripcion, precio, proveedor_id, total_producto):
        query = """
        UPDATE producto
        SET nombre = %s, descripcion = %s, precio = %s, proveedor_id = %s, totalProducto = %s
        WHERE id = %s
        """
        parametros = (nombre, descripcion, precio, proveedor_id, total_producto, id_producto)
        self.conexion.ejecutar_query(query, parametros)
        

    def deleteProduct(self, id_producto):
        query = """
        DELETE FROM producto
        WHERE id = %s
        """
        parametros = (id_producto,)
        
        self.conexion.ejecutar_query(query, parametros)

    def buscarProduct(self, busqueda):
        search_str = f'%{busqueda}%'

        query =  """
        SELECT producto.*, proveedor.nombre_empresa
        FROM producto
        JOIN proveedor ON producto.proveedor_id = proveedor.id
        WHERE producto.nombre LIKE %s OR producto.descripcion LIKE %s OR proveedor.nombre_empresa LIKE %s
        """

        parametros = (search_str, search_str, search_str)

        return self.conexion.obtener_registros(query, parametros)