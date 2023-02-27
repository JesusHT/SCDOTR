import cv2 as cv
import time as t

rute = "./datasets/img/train/"

def sleep():
    t.sleep(10)

def setNameProduct():
    return input("Ingresa el nombre del articulo: ")

def definePosition(i):
    return "front" if i <= 25 else "back" if i <= 50 else "two-way"

def CoolDown(i):
    
    options = {
        26: "\nPosicione el producto de la parte trasera\n",
        51: "\nPosicione el producto de la parte lateral izquierda\n",
        76: "\nPosicione el producto de la parte lateral derecha\n"
    }

    if i in options:
        print(options[i])
        sleep()

def catchCycle():
    getNameProduct = setNameProduct()

    print("\nPosicione el producto frontalmente\n")
    sleep()

    for i in range(1,101):

        CoolDown(i)
        
        captura = cv.VideoCapture(0)

        leido, frame = captura.read()

        position = definePosition(i)

        if leido == True:
            cv.imwrite(rute + getNameProduct + "_" + position + str(i) + ".jpg", frame)
            print("Foto tomada correctamente número " + str(i) + " posicion " + position)
        else:
            print("Error" + str(i))

        captura.release()

catchCycle()