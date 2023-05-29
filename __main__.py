import cv2
import supervision as sv
import json
from config.config import DETECTION_PATH
from ultralytics import YOLO
from flask import Flask, render_template, request, redirect, url_for, jsonify, session, Response, make_response
from libs.permissions import RoutePermission
from libs.login import Login
from libs.productos import Productos
from libs.provedores import Proveedores
from libs.validateData import ValidateData
from libs.estadisticas import Estadisticas

############################# INSTANCIAR ##############################################

app            = Flask(__name__)
app.secret_key = 'clave_secreta_aqui'
run_detection  = False
permission     = RoutePermission()
products       = Productos()
suppliers      = Proveedores()
validate       = ValidateData()
statistics     = Estadisticas()

############################# INDEX ###################################################

# CARGAR LA VISTA PRINCIPAL

@app.route('/') 
def index():
    return render_template('login.html')


############################# LOGIN - LOGOUT ##########################################

# INICIAR SESIÓN
@app.route('/login', methods=['POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        login = Login(username, password)   
        
        return jsonify(login.validate_user())   
    
    return render_template('login.html')

# CERAR SESIÓN 

@app.route('/logout')
def logout():
    session.clear()
    return redirect('/')


############################# PRODUCTOS ##########################################

# CARGAR VISTA

@app.route('/productos')
@permission.verificar_permiso("/productos", ['admin'])
def viewProductos():
    return render_template('productos.html', username=session.get("username"))

# OBTENER TODOS LOS PRODUCTOS 

@app.route('/productos/all')
def getProductsAll():
    producto = products.getProduct()

    return jsonify(producto)

# OBTENER PRODUCTO EN BASE A SU ID

@app.route('/productos/<int:id_product>', methods=['GET'])
def getProductByID(id_product):
    producto = products.getProductByID(id_product)
    return jsonify([producto[0]])

# AGREGAR NUEVO PRODUCTO

@app.route('/productos/add', methods=['POST'])
def setProduct():
    form_data = request.form

    data_dict = {
        'nombre'       : form_data['nombre'],
        'descripcion'  : form_data['descripcion'],
        'precio'       : form_data['precio'],
        'existencias'  : form_data['existencias'],
        'proveedor_id' : form_data['proveedor_id']
    }

    validar = validate.validar_producto(data_dict)

    if validar == True:
        products.setProduct(data_dict['nombre'], data_dict['descripcion'], data_dict['precio'], data_dict['proveedor_id'], data_dict['existencias'])
        return jsonify(True)
    else:
        return jsonify(validar)

# ACTUALIZAR UN PRODUCTO 

@app.route('/editar', methods=['POST'])
def updateProduct():
    form_data = request.form

    data_dict = {
        'id'          : form_data['id'],
        'nombre'      : form_data['nombre'],
        'descripcion' : form_data['descripcion'],
        'precio'      : form_data['precio'],
        'existencias' : form_data['existencias'],
        'proveedor_id': form_data['proveedor_id']
    }

    validar = validate.validar_producto(data_dict)

    if validar == True:
        products.updateProduct(data_dict['id'], data_dict['nombre'], data_dict['descripcion'], data_dict['precio'], data_dict['proveedor_id'], data_dict['existencias'])
        return jsonify(True)
    else:
        return jsonify(validar)

# ELIMINAR PRODUCTO 

@app.route('/productos/eliminar/<int:id_product>', methods=['GET'])
def deleteProduct(id_product):
    products.deleteProduct(id_product)

    return jsonify(True)

# CONTAR LA CANTIDAD DE PRODUCTOS 
    
@app.route('/productos/contar/<int:id_product>', methods=['GET'])
def contar(id_product):
    producto = products.getProductByID(id_product)
    
    cantidad = producto[0][5]

    if cantidad > 0:
        return jsonify(cantidad) 

    return jsonify(False)

# BUSCAR UN PRODUCTO EN BASE A SU NOMBRE, DESCRIPCIÓN O PROVEEDOR    

@app.route('/productos/buscar/<string:search>', methods=['GET'])
def searchProduct(search):
    producto = products.buscarProduct(search)
    return jsonify(producto)


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

# OBTENER LAS VENTAS GENERALES

@app.route('/estadisticas/periodos')
def getSalesAll():
    return statistics.obtener_compras_total_ventas()

# OBTENER LAS VENTAS POR MES

@app.route('/estadisticas/ventaspormes/<int:mes>', methods=['GET'])
def getSalesByMonth(mes):
    return statistics.obtener_compras_total_ventas(mes)

# OBTENER LOS 5 PRODUCTOS MÁS VENDIDOS POR PERIODO (MES)

@app.route('/estadisticas/productosmasvendidos/<int:mes>', methods=['GET'])
def getBestSellingProductsByMes(mes):
    if mes == 0:
        return statistics.getBestSellingProducts()
    else :
        return statistics.getBestSellingProductsByMes(mes)
    
# OBTENER LOS PRODUCTOS VENDIDOS
@app.route('/estadisticas/productosvendidos/<int:mes>', methods=['GET'])
def obtener_productos_vendidos(mes):
    if mes == 0 :
        mes = None
    return statistics.obtener_productos_vendidos(mes)

# OBTENER LAS GANCIAS POR MES
@app.route('/gananciaspormes/<int:mes>', methods=['GET'])
def getGanaciasByMonth(mes):
    return statistics.getGanaciasByMonth(mes)

# OBTENER LOS DETALLES DE COMPRA POR ID
@app.route('/estadisticas/detallesdecompra/<int:idCompra>', methods=['GET'])
def getPurchaseDetails(idCompra):
    return statistics.getPurchaseDetails(idCompra)

# VALIDAR SI SE NECECITA STOCK
@app.route('/stock')
def verifyingStock():
    return jsonify(statistics.verifyingStock())

# BUSCAR VENTAS 

@app.route('/estadisticas/buscar', methods=['POST'])
def searchDetails():
    data = request.form

    mes = None if data['mes'] == '0' else data['mes']

    return statistics.searchDetails(data['search'], mes)

    

############################# COBROS ##########################################

# CARGAR VISTA DE COBRO

@app.route('/cobro')
@permission.verificar_permiso("/cobro", ['user'])
def viewCobro():
    return render_template('cobro.html', username=session.get("username"))

# GENERAR VIDEO DE LA DETECCIÓN 

def generate_frames():
    cap = cv2.VideoCapture(0)
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)

    model = YOLO("best.pt")

    box_annotator = sv.BoxAnnotator(
        thickness=2,
        text_thickness=2,
        text_scale=1
    )

    while True:
        ret, frame = cap.read()
        
        if run_detection:
            result = model(frame, agnostic_nms=True)[0]
            detections = sv.Detections.from_yolov8(result)

            labels = [
                f"{model.model.names[int(c)]} {confidence:0.2f}"
                for _,_, confidence, c, _
                in detections
            ]

            frame = box_annotator.annotate(
                scene=frame, 
                detections=detections, 
                labels=labels
            ) 
            
        # Convertimos el frame en un objeto de respuesta de Flask
        frame_encoded = cv2.imencode('.jpg', frame)[1]
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_encoded.tobytes() + b'\r\n')
                
        if (cv2.waitKey(30) == 27):
            break
            
    cap.release()
    cv2.destroyAllWindows()

# CARGAR EL VIDEO A LA VISTA 

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

# INICIAR DETECCIÓN DE OBJETOS

@app.route('/detect', methods=['POST'])
def detect():
    global run_detection
    run_detection = True
    return jsonify(True)

# DETENER DETECCIÓN DE OBJETOS    

@app.route('/stop_detect', methods=['POST'])
def stop_detect():
    global run_detection
    run_detection = False
    return jsonify(True)    

# OBTENER DETECCIONES 

@app.route('/get_detections', methods=['GET'])
def get_detections():
    with open(DETECTION_PATH, 'r') as file:
        data = json.load(file)

    return jsonify(data)

# REINICIAR EL JSON 

@app.route('/restart_detections', methods=['GET'])
def restart_detections():
    data = []
    
    with open(DETECTION_PATH, 'w') as file:
        json.dump(data, file)

    return jsonify(True)

# ELIMINAR EL PRODUCTO QUE EL USUARIO NO SE QUIERE LLEVAR

@app.route('/nuevoproductos', methods=['POST'])
def newProducts():
    data = request.get_json()

    with open(DETECTION_PATH, 'w') as file:
        json.dump(data, file)   

    return jsonify(True)


# PAGAR PRODUCTOS

@app.route('/pagarproductos', methods=['POST'])
def payProducts():
    data = request.form

    print(data)

    return jsonify(True)

############################# INICIAR PROGRAMA ##########################################

if __name__ == '__main__':
    app.run(debug=True, port=7070)