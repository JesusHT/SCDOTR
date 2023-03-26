import cv2 as cv
import time as t
import os as sy

rute = "./datasets/img/train/"

def setNameProduct():
    return input("Ingresa el nombre del articulo: ")

def setCantPosition():
    cant = int(input("Ingresa la cantidad de caras del objeto: "))

    if cant > 0 and cant <= 6:
        return cant
    else:
        print("\nLa cantidad de posciones debe ser al menos 1 o maximo 6.\n")
        setCantPosition()

def getPositions(i):
    positions = {
        1: "Frontal",
        2: "Trasero",
        3: "Lateral_izquierdo",
        4: "Lateral_derecho",
        5: "Arriba",
        6: "Abajo"
    }

    return positions[i] 

def takePhoto(i, product_name, position):

    for i in range(1, 201):
        try:
            capture = cv.VideoCapture(1)
            leido, frame = capture.read()

            if leido == True:
                filename = f"{rute}{product_name}_{position}{i}.jpg"
                cv.imwrite(filename, frame)
                print(f"\nFoto tomada correctamente número {i} en posición {position}")
            else:
                print(f"Error al tomar foto {i}")
        except Exception as e:
            print(f"Error: {e}")

        capture.release()

def takeProductPhotos():
    product_name = setNameProduct()
    cant_position = setCantPosition()
    
    for i in range(1, int(cant_position + 1)):
        position = getPositions(i)
        
        sy.system("clear")
        print(f"\nPosicione el producto de forma {position}\n")
        
        t.sleep(10)

        takePhoto(i, product_name, position)

takeProductPhotos()
