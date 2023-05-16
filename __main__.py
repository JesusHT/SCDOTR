from flask import Flask, render_template, request, redirect, url_for, jsonify, session
from libs.permissions import RoutePermission
from libs.login import Login
from libs.productos import Productos
from libs.provedores import Proveedores
from libs.validateData import ValidateData
from libs.estadisticas import Estadisticas

############################# INSTANCIAR ##############################################

app            = Flask(__name__)
app.secret_key = 'clave_secreta_aqui'
permission     = RoutePermission()
products       = Productos()
suppliers      = Proveedores()
validate       = ValidateData()
statistics     = Estadisticas()

############################# INDEX ###################################################

@app.route('/') 
def index():
    return render_template('login.html')

############################# LOGIN - LOGOUT ##########################################

@app.route('/login', methods=['POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        login = Login(username, password)   
        
        return jsonify(login.validate_user())   
    
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.clear()
    return redirect('/')

############################# PRODUCTOS ##########################################

@app.route('/productos')
@permission.verificar_permiso("/productos", ['admin'])
def viewProductos():
    return render_template('productos.html', username=session.get("username"))

@app.route('/productos/all')
def productsAll():
    producto = products.getProduct()

    return jsonify(producto)

@app.route('/productos/<int:id_product>', methods=['GET'])
def producto(id_product):
    producto = products.getProductByID(id_product)
    proveedores = suppliers.getAllProveedores()
    return jsonify([producto[0], proveedores])

@app.route('/editar', methods=['POST'])
def updateProduct():
    form_data = request.form

    data_dict = {
        'id': form_data['id'],
        'nombre': form_data['nombre'],
        'descripcion': form_data['descripcion'],
        'precio': form_data['precio'],
        'existencias': form_data['existencias'],
        'proveedor_id': form_data['proveedor_id']
    }

    validar = validate.validar_producto(data_dict)

    if validar == True:
        products.updateProduct(data_dict['id'], data_dict['nombre'], data_dict['descripcion'], data_dict['precio'], data_dict['proveedor_id'], data_dict['existencias'])
        return jsonify(True)
    else:
        print(validar)
        return jsonify(validar)
    
@app.route('/productos/contar/<int:id_product>', methods=['GET'])
def contar(id_product):
    producto = products.getProductByID(id_product)
    
    cantidad = producto[0][5]

    if cantidad > 0:
        return jsonify(cantidad) 

    return jsonify(False)

@app.route('/productos/eliminar/<int:id_product>', methods=['GET'])
def eliminar(id_product):
    products.deleteProduct(id_product)

    return jsonify(True)

@app.route('/productos/buscar/<string:search>', methods=['GET'])
def buscar(search):
    producto = products.buscarProduct(search)
    return jsonify(producto)

@app.route('/productos/add', methods=['POST'])
def addProduct():
    form_data = request.form

    data_dict = {
        'nombre': form_data['nombre'],
        'descripcion': form_data['descripcion'],
        'precio': form_data['precio'],
        'existencias': form_data['existencias'],
        'proveedor_id': form_data['proveedor_id']
    }

    validar = validate.validar_producto(data_dict)

    if validar == True:
        products.setProduct(data_dict['nombre'], data_dict['descripcion'], data_dict['precio'], data_dict['proveedor_id'], data_dict['existencias'])
        return jsonify(True)
    else:
        return jsonify(validar)


############################# PROVEDROES ##########################################

# CARGAR VISTA 

@app.route('/proveedores') 
@permission.verificar_permiso("/proveedores", ['admin'])
def viewProveedores():
    return render_template('proveedores.html', username=session.get("username"))

# OBTENER LISTA DE PROVEEDORES 

@app.route('/proveedores/obtener')
def getProveedores():
    proveedores = suppliers.getAllProveedores()

    return jsonify(proveedores)

# OBTENER UN PROVEEDOR ESPECIFICO EN BASE A SU ID

@app.route('/proveedores/<int:id_proveedor>', methods=['GET'])
def getProveedorById(id_proveedor):
    proveedor = suppliers.getProveedorByID(id_proveedor)

    return jsonify(proveedor[0])

# INSERTAR UN NUEVO PROVEEDOR 

@app.route('/proveedores/agregar', methods=['POST'])
def setProveedor():
    data = request.form

    data_dict = {
        'nombre_empresa'  : data['name-empresa'],
        'nombre_contacto' : data['name-contacto'],
        'telefono'        : data['telefono'],
        'email'           : data['email']
    }

    validar = validate.validar_proveedor(data_dict)

    if validar == True:
        suppliers.setProveedor(data_dict['nombre_empresa'], data_dict['nombre_contacto'], data_dict['telefono'], data_dict['email'])
        return jsonify(True)
    else: 
        return jsonify(validar)

# ACTUALIZAR INFORMACIÓN DE UN PROVEEDOR EN BASE A SU ID 

@app.route('/proveedores/actualizar', methods=['POST'])
def updateProveedor():
    data = request.form

    data_dict = {
        'id'              : data['id'],
        'nombre_empresa'  : data['name-empresa'],
        'nombre_contacto' : data['name-contacto'],
        'telefono'        : data['telefono'],
        'email'           : data['email']
    }

    validar = validate.validar_proveedor(data_dict)

    if validar == True:
        suppliers.updateProveedor(data_dict['id'], data_dict['nombre_empresa'], data_dict['nombre_contacto'], data_dict['telefono'], data_dict['email'])
        return jsonify(True)
    else:
        return jsonify(validar)

# CONTAR USO DE PROVEEDOR EN BASE A SU ID

@app.route('/proveedores/contar/<int:id_proveedor>', methods=['GET'])
def countProductsUsingSupplierById(id_proveedor):
    return suppliers.countProductsUsingSupplierById(id_proveedor)

# ELIMINAR PROVEEDOR 

@app.route('/proveedores/eliminar/<int:id_proveedor>', methods=['GET'])
def deleteProveedor(id_proveedor):
    suppliers.deleteProveedor(id_proveedor)

    return jsonify(True)

# BUSCAR PROVEEDORES APARTIR DE NOMBRE DEL CONTACTO O EMPRESA

@app.route('/proveedores/buscar/<string:search>', methods=['GET'])
def searchProveedor(search):
    proveedores = suppliers.searchSupplier(search)

    return jsonify(proveedores)

############################# ESTADISTICA ##########################################

@app.route('/estadisticas')
@permission.verificar_permiso("/estadisticas", ['admin'])
def viewEstadisticas():
    return render_template('estadisticas.html', username=session.get("username"))

# OBTENER LOS 5 PRODUCTOS MÁS VENDIDOS EN GENERAL

@app.route('/estadisticas/productosmasvendidos')
def getBestSellingProducts():
    return statistics.getBestSellingProducts()

# OBTENER FECHAS DE LAS COMPRAS 

@app.route('/estadisticas/fechas')
def getFechasCompras():
    return statistics.getFechasCompras()

# OBTENER LOS 5 PRODUCTOS MÁS VENDIDOS POR PERIODO (MES)

@app.route('/estadisticas/productosmasvendidos/<int:mes>', methods=['GET'])
def getBestSellingProductsByMes(mes):
    if mes == 0:
        return statistics.getBestSellingProducts()
    else :
        return statistics.getBestSellingProductsByMes(mes)


############################# COBROS ##########################################

############################# INICIAR PROGRAMA ##########################################

if __name__ == '__main__':
    app.run(debug=True, port=7070)
