from flask import Flask, render_template, request, redirect, url_for, jsonify, session
from libs.permissions import RoutePermission
from libs.login import Login
from libs.productos import Productos
from libs.provedores import Proveedores
from libs.validateData import ValidateData

############################# INSTANCIAR ##########################################

app = Flask(__name__)
app.secret_key = 'clave_secreta_aqui'
permission = RoutePermission()
products = Productos()
suppliers = Proveedores()
validate = ValidateData()

############################# INDEX ##########################################

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
def productoAll():
    return render_template('index.html', username=session.get("username"))

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


############################# PROVEDROES ##########################################

@app.route('/proveedores/obtener')
def getProveedores():
    proveedores = suppliers.getAllProveedores()
    print(proveedores)

    return jsonify(proveedores)

############################# ESTADISTICA ##########################################

############################# COBROS ##########################################

############################# INICIAR PROGRAMA ##########################################

if __name__ == '__main__':
    app.run(debug=True, port=7070)
