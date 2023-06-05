from libs.connection import MySQLConnection
import datetime

class Purchases:
    def __init__(self):
        self.conexion = MySQLConnection()

    def getAllProducts(self):
        sql = "SELECT * FROM producto"

        resutls = self.conexion.obtener_registros(sql)  

        return resutls

    def getIdProducts(self, nombres_productos):
        productos = self.formatted_results(self.getAllProducts())

        resultados = {}

        for producto in productos:
            nombre = producto['Nombre']
            if nombre in nombres_productos:
                resultados[nombre] = {'Id': producto['Id'], 'Stock': producto['Stock'], 'Precio': producto['Precio']}

        return resultados
        
    def formatted_results(self, data):
        formatted_results = [{
            "Id"          : row[0],
            "Nombre"      : row[1],
            "Descripcion" : row[2],
            "Precio"      : row[3],
            "IdProveedor" : row[4],
            "Stock"       : row[5]
        } for row in data]

        return formatted_results

    def formatted_claves(self, claves):
        for i in range(len(claves)):
            if claves[i].count('_') == 2:
                claves[i] = claves[i].replace('_', '-', 1)

        return claves

    def formatted_clave(self, clave):
        if clave.count('_') == 2:
            clave = clave.replace('_', '-', 1)

        return clave
    
    def validateStock(self, productos, productos_formateados):
        for clave, valor in productos.items():
            if clave != 'pago' and clave != 'total':
                if int(valor) <= int(productos_formateados[self.formatted_clave(clave)]['Stock']):
                    return True
                else :
                    return False

    def validateTotal(self, productos, productos_formateados):
        total = 0

        for clave, valor in productos.items():
            if clave!= 'pago' and clave != 'total':
                total += int(valor) * productos_formateados[self.formatted_clave(clave)]['Precio']

        if "{:.2f}".format(float(total)) ==  "{:.2f}".format(float(productos['total'])):
            return True
        else :
            return False

    def formatted_data(self, productos, productos_formateados):
        new_data = {}

        for clave, valor in productos.items():
            if clave != 'pago' and clave != 'total':
                new_data[productos_formateados[self.formatted_clave(clave)]['Id']] = { 'cantidad' : valor}

        return new_data
                
                    
    def setCompra(self, data):
        claves = [clave for clave in data.keys() if clave not in ['pago', 'total']]
        productos_formateados = self.getIdProducts(self.formatted_claves(claves))
        
        if self.validateStock(data, productos_formateados):
            if self.validateTotal(data, productos_formateados):
                detalles = self.formatted_data(data, productos_formateados)
                ID = self.setNewCompra(data)
                self.setDetallesCompra(detalles, ID)
                
                return ['True', [data['pago'], data['total']]]
                    
            else :
                return ['False', 'Error fatal']
        else :
            return ['False', 'No hay stock suficiente']

    def setNewCompra(self, data):
        sql = """
                INSERT INTO `Compra` (`FechaCompra`, `TotalCompra`, `Pago`) VALUES (%s, %s, %s);
              """

        fecha = self.getFecha()

        parametros = (fecha, data['total'], data['pago'],)

        self.conexion.ejecutar_query(sql, parametros)

        return self.getIdCompra()

    def setDetallesCompra(self, detalles, ID):
            try:
                for producto_id, detalle in detalles.items():
                    cantidad = int(detalle['cantidad'])

                    query = """
                        INSERT INTO DetallesCompra (IdCompra, IdProducto, Cantidad, Descuento)
                        VALUES (%s, %s, %s, %s)
                    """
                    parametros = (ID, producto_id, cantidad, 0)

                    self.conexion.ejecutar_query(query, parametros)


            except mysql.connector.Error as error:
                print(f"Error al insertar detalles de compra: {error}")
        
    
    def getIdCompra(self):
        sql = "SELECT IdCompra FROM Compra ORDER BY IdCompra DESC LIMIT 1;"

        resutls = self.conexion.obtener_registros(sql)

        return resutls[0][0]


    def getFecha(self):
        return datetime.datetime.now().strftime('%Y-%m-%d')
