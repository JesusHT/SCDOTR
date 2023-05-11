from flask import Flask, render_template, request, redirect, url_for, jsonify, session
from libs.permissions import RoutePermission
from libs.connection import MySQLConnection
from libs.login import Login
from libs.productos import Productos
from libs.provedores import Proveedores

############################# INSTANCIAR ##########################################

app = Flask(__name__)
app.secret_key = 'clave_secreta_aqui'
permission = RoutePermission()
products = Productos()
suppliers = Proveedores()

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
def producto():
    productos = products.getProduct()
    return render_template('index.html', productos=productos, username=session.get("username"))

@app.route('/productos/<int:id_product>', methods=['GET'])
def ruta_con_parametro(id_product):
    producto = products.getProductByID(id_product)
    proveedores = suppliers.getAllProveedores()
    return jsonify([producto[0], proveedores])


############################# PROVEDROES ##########################################

############################# ESTADISTICA ##########################################

############################# COBROS ##########################################

############################# INICIAR PROGRAMA ##########################################

if __name__ == '__main__':
    app.run(debug=True, port=8000)
