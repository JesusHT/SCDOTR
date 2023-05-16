from libs.connection import MySQLConnection

class Estadisticas:
    def __init__(self):
        self.conexion = MySQLConnection()

    def getBestSellingProducts(self):
        query = """
            SELECT producto.nombre, SUM(DetallesCompra.Cantidad) AS TotalVendido FROM DetallesCompra 
            INNER JOIN producto ON DetallesCompra.IdProducto = producto.Id GROUP BY DetallesCompra.IdProducto 
            ORDER BY TotalVendido DESC LIMIT 5 
        """

        return self.conexion.obtener_registros(query)

    def getFechasCompras(self):
        query = """
            SELECT MONTH(FechaCompra) AS Mes FROM Compra GROUP BY MONTH(FechaCompra) ORDER BY Mes ASC
        """

        return self.conexion.obtener_registros(query)

    def getBestSellingProductsByMes(self, mes):
        query = """
            SELECT p.nombre, SUM(dc.Cantidad) AS CantidadVendida
            FROM DetallesCompra dc
            JOIN producto p ON dc.IdProducto = p.id
            JOIN Compra c ON dc.IdCompra = c.IdCompra
            WHERE MONTH(c.FechaCompra) = %s
            GROUP BY dc.IdProducto
            ORDER BY CantidadVendida DESC
            LIMIT 5;
        """
        parametros = (mes,)

        return self.conexion.obtener_registros(query, parametros)