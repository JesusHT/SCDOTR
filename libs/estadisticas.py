from libs.connection import MySQLConnection
import datetime

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

    def obtener_compras_total_ventas(self, mes=None):
        query = """
            SELECT
                C.IdCompra,
                C.FechaCompra,
                C.TotalCompra
            FROM
                Compra C
            WHERE
                MONTH(C.FechaCompra) = %s OR %s IS NULL;
        """

        parametros = (mes, mes) if mes else (None, None)

        registros = self.conexion.obtener_registros(query, parametros)        

        return registros

    def obtener_productos_vendidos(self, mes=None):
        sql = """
            SELECT c.IdCompra, 
                   c.FechaCompra, 
                   c.TotalCompra, 
                   c.Pago, 
                   c.Cambio, 
                   dc.IdProducto, 
                   dc.IdCompra AS IdCompraDetalles, 
                   dc.IdProducto AS IdProductoDetalles, 
                   dc.PrecioProducto,
                   dc.Cantidad, 
                   dc.Descuento,
                   p.nombre AS Nombre
            FROM Compra c
            INNER JOIN DetallesCompra dc ON c.IdCompra = dc.IdCompra
            INNER JOIN producto p ON dc.IdProducto = p.id
            WHERE MONTH(c.FechaCompra) = %s OR %s IS NULL;
            """
        
        parametros = (mes, mes) if mes else (None, None)

        results = self.conexion.obtener_registros(sql, parametros)
    
        formatted_results = [{
            "IdCompra"           : int(row[0]),
            "FechaCompra"        : (
                datetime.datetime.strptime(str(row[1]), "%a, %d %b %Y %H:%M:%S %Z").strftime("%Y-%m-%d")
                if isinstance(row[1], str)
                else row[1].strftime("%Y-%m-%d")
            ),
            "TotalCompra"        : "{:.2f}".format(float(row[2])),
            "Pago"               : "{:.2f}".format(float(row[3])),
            "Cambio"             : "{:.2f}".format(float(row[4])),
            "IdProducto"         : int(row[5]),
            "IdCompraDetalles"   : int(row[6]),
            "IdProductoDetalles" : int(row[7]),
            "PrecioProducto"     : "{:.2f}".format(float(row[8])),
            "Cantidad"           : "{:.2f}".format(float(row[9])),
            "Descuento"          : "{:.2f}".format(float(row[10])),
            "Nombre"             : row[11]
        } for row in results]
        

        return formatted_results
    
    def getGanaciasByMonth(self, mes):
        sql = """
            SELECT SUM(TotalCompra) AS TotalMes FROM Compra WHERE MONTH(FechaCompra) = %s;
            """

        parametros = (mes,)

        results = self.conexion.obtener_registros(sql, parametros) 

        ganancias = [{
            "ganancias": "{:.2f}".format(float(row[0])),
        } for row in results]       

        return ganancias

    def getPurchaseDetails(self, idCompra):
        sql = """
                SELECT c.IdCompra, c.FechaCompra, p.nombre AS NombreProducto, dc.Cantidad, dc.PrecioProducto, dc.Descuento
                    FROM Compra c
                    JOIN DetallesCompra dc ON c.IdCompra = dc.IdCompra
                    JOIN producto p ON dc.IdProducto = p.id
                WHERE c.IdCompra = %s;
              """
        parametros = (idCompra,)

        results = self.conexion.obtener_registros(sql, parametros)

        formatted_results = [{
            "IdCompra"       : int(row[0]),
            "Fecha"          : (datetime.datetime.strptime(str(row[1]), "%a, %d %b %Y %H:%M:%S %Z").strftime("%Y-%m-%d")
                                if isinstance(row[1], str)
                                else row[1].strftime("%Y-%m-%d")),
            "Nombre"         : row[2],
            "Cantidad"       : int(row[3]),
            "PrecioProducto" : "{:.2f}".format(float(row[4])),
            "Descuento"      : "{:.2f}".format(float(row[5]))
        } for row in results]

        return formatted_results

    def verifyingStock(self):
        conexion = MySQLConnection()

        sql = """
              SELECT proveedor.nombre_empresa, proveedor.nombre_contacto, proveedor.telefono, proveedor.email, producto.totalProducto, producto.nombre 
                  FROM producto 
                  JOIN proveedor ON producto.proveedor_id = proveedor.id 
              WHERE producto.totalProducto <= 5; 
              """

        results = conexion.obtener_registros(sql)

        conexion.cerrar_conexion()

        if not results:
            return 'False'
        else: 
            formatted_results = [{
                "NombreEmpresa"    : row[0],
                "NombreContacto"   : row[1],
                "Telefono"         : row[2],
                "Email"            : row[3],
                "TotalProducto"    : int(row[4]),
                "NombreProducto"   : row[5]
            } for row in results]

            return formatted_results


    def searchDetails(self, search, mes=None):
        search_str = f'%{search}%'

        query = """
                SELECT DISTINCT
                    C.IdCompra,
                    C.FechaCompra,
                    C.TotalCompra
                FROM
                    Compra C
                    JOIN DetallesCompra DC ON C.IdCompra = DC.IdCompra
                    JOIN producto P ON DC.IdProducto = P.id
                WHERE
                    (P.nombre LIKE %s OR C.IdCompra LIKE %s)
                    AND (MONTH(C.FechaCompra) = %s OR %s IS NULL)
                """
        parameters = [search_str, search_str, mes, mes,]

        results = self.conexion.obtener_registros(query, parameters)

        return results
