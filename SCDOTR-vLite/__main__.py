import cv2
import supervision as sv
import json
from ultralytics import YOLO
from flask import Flask, render_template, request, redirect, url_for, jsonify, session, Response, make_response
from libs.purchases import Purchases
from config.config import DETECTION_PATH

############################# INSTANCIAR ##############################################

app            = Flask(__name__)
run_detection  = False
pay            = Purchases()

############################# INDEX ###################################################

# CARGAR LA VISTA PRINCIPAL

@app.route('/')
def index():
    return render_template('index.html')

# GENERAR VIDEO DE LA DETECCIÓN 

def generate_frames():
    cap = cv2.VideoCapture(0)
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)

    model = YOLO("best.pt")

    box_annotator = sv.BoxAnnotator(
        thickness       = 2,
        text_thickness  = 2,
        text_scale      = 1
    )

    while True:
        ret, frame = cap.read()
        
        if run_detection:
            result = model(frame, agnostic_nms=True)[0]
            detections = sv.Detections.from_yolov8(result)

            
            products = []

            try:
                with open(DETECTION_PATH, "r") as archivo_json:
                    products = json.load(archivo_json)
            except FileNotFoundError:
                products = []

            labels = [
                f"{model.model.names[int(c)]} {confidence:0.2f}"
                for _, _, confidence, c, _
                in detections
            ]

            if detections:
                class_id = int(detections.class_id[0])

                new_product = {"names": model.model.names[class_id]}

                if new_product not in products:
                    products.append(new_product)

                with open(DETECTION_PATH, "w") as archivo_json:
                    json.dump(products, archivo_json)

            frame = box_annotator.annotate(
                scene=frame,
                detections=detections,
                labels=labels
            )
            
        frame_encoded = cv2.imencode('.jpg', frame)[1]
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_encoded.tobytes() + b'\r\n')
                
        if (cv2.waitKey(30) == 27):
            break
            
    cap.release()
    cv2.destroyAllWindows()

# CARGAR PRODUCTOS

@app.route('/productos/all')
def getProductsAll():
    producto = pay.getAllProducts()

    return jsonify(producto)

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

    return jsonify(pay.setCompra(data))


############################# INICIAR PROGRAMA ##########################################

if __name__ == '__main__':
    app.run(debug=True, port=9070)

    # 1379  sudo fuser -k 7070/tcp