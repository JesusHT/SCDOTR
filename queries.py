from conexion import conectar

db = conectar()

def getProductQuantity(nombre_producto):
    cursor = db.cursor()
    
    query = "SELECT totalProducto FROM producto WHERE nombre = %s"
    
    cursor.execute(query, (nombre_producto,))
    
    result = cursor.fetchone()[0]
    
    return result

def productExists(nombre_producto):
    cursor = db.cursor()

    query = "SELECT COUNT(*) FROM producto WHERE nombre = %s"
    cursor.execute(query, (nombre_producto,))
    result = cursor.fetchone()

    if result[0] > 0:
        return True
    else:
        return False


def updateProductQuantity(nombre_producto, cantidad):
    try:
        cursor = db.cursor()

        query = "UPDATE producto SET totalProducto = %s WHERE nombre = %s"
        
        nueva_cantidad = getProductQuantity(nombre_producto) + cantidad
        
        cursor.execute(query, (nueva_cantidad, nombre_producto))
        
        db.commit()
        
        return True
    except Exception as e:
        print("Error al actualizar la cantidad del producto:", e)
        db.rollback()
        return False
    finally:
        cursor.close()

def getAllProducts():
    cursor = db.cursor()

    query = "SELECT producto.nombre, proveedor.nombre_empresa, proveedor.telefono , producto.totalProducto, producto.precio FROM producto INNER JOIN proveedor ON producto.proveedor_id = proveedor.id;"
    
    cursor.execute(query)
    results = cursor.fetchall()
    
    cursor.close()
    
    return results

# Definimos la función de búsqueda
def searchProduct(search_term):
    cursor = db.cursor()
    query = """
        SELECT producto.nombre, proveedor.nombre_empresa, proveedor.telefono, producto.totalProducto, producto.precio
        FROM producto
        INNER JOIN proveedor
        ON producto.proveedor_id = proveedor.id
        WHERE producto.nombre LIKE %s OR proveedor.nombre_empresa LIKE %s;
    """
    search_term = f"%{search_term}%"
    cursor.execute(query, (search_term, search_term))
    result = cursor.fetchall()
    cursor.close()
    return result

def updateSupplier(supplier_id, new_name, new_company_name, new_phone, new_email):
    cursor = db.cursor()

    query = "UPDATE proveedor SET nombre = %s, nombre_empresa = %s, telefono = %s, email = %s WHERE id = %s"

    values = (new_name, new_company_name, new_phone, new_email, supplier_id)

    cursor.execute(query, values)

    db.commit()

    cursor.close()

    return True

def addSupplier(name, company_name, phone, email):
    cursor = db.cursor()

    query = "INSERT INTO proveedor (nombre, nombre_empresa, telefono, email) VALUES (%s, %s, %s, %s)"

    values = (name, company_name, phone, email)

    cursor.execute(query, values)

    db.commit()

    cursor.close()

    return True