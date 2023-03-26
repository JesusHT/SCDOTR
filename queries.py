from conexion import conectar

# Conecta a la base de datos
db = conectar()

# Crea una función para mostrar contactos
def show_products():
    # Crea un cursor para ejecutar consultas SQL
    cursor = db.cursor()

    # Ejecuta la consulta SQL para mostrar todos los contactos
    sql = "SELECT id, name, email FROM cliente"
    cursor.execute(sql)

    # Obtiene todos los resultados de la consulta
    results = cursor.fetchall()
    
    return results

def get_total_products(producto):
    cursor = db.cursor()
    sql = "SELECT total FROM productos WHERE nombre_producto = ?"
    cursor.execute(sql, (producto,))

    resultado = cursor.fetchone()

def update_product_count(product, count):
    cursor = db.cursor()
    sql = "UPDATE productos SET total = ? WHERE nombre_producto = ?"
    cursor.execute(sql, ())
