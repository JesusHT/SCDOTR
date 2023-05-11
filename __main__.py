from flask import Flask, render_template, request, redirect, url_for, jsonify, session
from libs.permissions import RoutePermission
from libs.connection import MySQLConnection
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
    productos = products.getProduct()
    return render_template('index.html', productos=productos, username=session.get("username"))

@app.route('/productos/<int:id_product>', methods=['GET'])
def producto(id_product):
    producto = products.getProductByID(id_product)
    proveedores = suppliers.getAllProveedores()
    return jsonify([producto[0], proveedores])

@app.route('/editar', methods=['POST'])
def updateProduct():
    validar = None  # inicializar la variable validar a None
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


############################# PROVEDROES ##########################################

############################# ESTADISTICA ##########################################

############################# COBROS ##########################################

############################# INICIAR PROGRAMA ##########################################

if __name__ == '__main__':
    app.run(debug=True, port=7070)
