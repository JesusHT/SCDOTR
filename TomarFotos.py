import cv2 as cv
import time as t

rute = "./datasets/img/train/"

def setNameProduct():
    return input("Ingresa el nombre del articulo: ")

def getPosition(i):
    return "front" if i <= 25 else "back" if i <= 50 else "two-way"

def takePhoto(i, product_name):
    options = {
        26: "\nPosicione el producto de la parte trasera\n",
        51: "\nPosicione el producto de la parte lateral izquierda\n",
        76: "\nPosicione el producto de la parte lateral derecha\n"
    }

    if i in options:
        print(options[i])
        t.sleep(5)

    try:
        capture = cv.VideoCapture(0)
        leido, frame = capture.read()
        position = getPosition(i)

        if leido == True:
            filename = f"{rute}{product_name}_{position}{i}.jpg"
            cv.imwrite(filename, frame)
            print(f"Foto tomada correctamente número {i} en posición {position}")
        else:
            print(f"Error al tomar foto {i}")
    except Exception as e:
        print(f"Error: {e}")

    capture.release()

def takeProductPhotos():
    product_name = setNameProduct()
    
    print("\nPosicione el producto frontalmente\n")
    t.sleep(5)

    for i in range(1, 101):
        takePhoto(i, product_name)

takeProductPhotos()
