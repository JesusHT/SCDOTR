import cv2 as cv

def print_screen():
    
    for i in range(1,6):
        captura = cv.VideoCapture(0)

        leido, frame = captura.read()

        if leido == True:
            cv.imwrite("./datasets/muestra_" + str(i) + ".png", frame)
            print("Foto tomada correctamente")
        else:
            print("Error" + str(i))

        captura.release()