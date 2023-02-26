# SCDOTR

El sistema de detección de objetos para inventarios en tiempo real usando Raspberry Pi con algoritmo YOLO es una solución tecnológica que permite detectar y contabilizar objetos en tiempo real para llevar un control de inventarios. Utiliza una cámara conectada a una Raspberry Pi y el algoritmo YOLO (You Only Look Once) para detectar y reconocer objetos en imágenes y video en tiempo real.

El algoritmo YOLO utiliza una red neuronal convolucional para analizar y clasificar objetos en imágenes en tiempo real, lo que lo hace adecuado para aplicaciones en tiempo real como la gestión de inventarios. Además, la Raspberry Pi es una plataforma de hardware de bajo costo y alta eficiencia energética que se puede utilizar para implementar el sistema.

En resumen, este sistema de detección de objetos para inventarios en tiempo real usando Raspberry Pi con algoritmo YOLO ofrece una solución eficaz y de bajo costo para automatizar el control de inventarios en empresas y negocios.


## Requisitos previos

    - Acceso de administrador (para instalar los paquetes)
    - Acceso a la camara
    - Librerias
        1. tkinter
        2. OpenCV
        3. YOLO
        4. TensorFlow
        5. mysql-connector-python
        6. Pytorch

## Instrucciones de instalación para Ubuntu/Raspbian/Debian

Clona este repositorio en tu computadora local. Abre la terminal y navega hasta la ubicación del archivo install_libraries.sh.
Ejecuta el siguiente comando para dar permisos de ejecución al script:

```shell

chmod +x install_libraries.sh
```

Ejecuta el script con el siguiente comando:

```shell

./install_libraries.sh
```

Este script instalará automáticamente las librerías de Python en tu sistema Ubuntu/Raspbian/Debian.
