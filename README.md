# SCDOTR - Sistema de Cobro por Detección de Objetos en Tiempo Real

El Sistema de Cobro por Detección de Objetos en Tiempo Real (SCDOTR) es una solución desarrollada en Python que utiliza detección de objetos basada en YOLO para permitir el cobro automatizado de productos empaquetados en una tienda.

## Características

- Detección de objetos en tiempo real utilizando YOLO y OpenCV.
- Interfaz de usuario basada en HTML, CSS y JavaScript con Bootstrap.
- Generación de facturas en formato PDF utilizando pdfmake (vPro).
- Gestión de inventario y base de datos utilizando Flask y MySQL Connector/Python (vPro).

## Requisitos

### Versión Pro

- Procesador Intel Core i3 o superior con gráficos integrados.
- Mínimo 8 GB de RAM.
- Espacio de almacenamiento mínimo de 1 GB.

### Versión Lite

- Procesador de cuatro núcleos a 1,5 GHz con gráficos integrados.
- Mínimo 8 GB de RAM.
- Espacio de almacenamiento mínimo de 1 GB.

## Instalación

1. Clona este repositorio en tu máquina local.
2. Descarga e instala Python en tu sistema.
3. Instala las dependencias necesarias:
  - Flask
  - Ultralytics
  - Mysql.connector
  - Supervision
  - OpenCV

## Uso

1. Navega al directorio de la versión que deseas utilizar (SCDOTR-vLite o SCDOTR-vPro).
2. Actualiza la configuración en el archivo `config.py` según tus necesidades.
  ```python

    # BASE DE DATOS
    PASSWORD = 'Tu_contraseña'
    DB       = 'inventario'
    CHARSET  = 'utf8mb4'
    USER     = 'tu_usuario'
    HOST     = 'tu_host'

    # CONFIGURACION DE RUTAS 
    # Si estas en windows cambia las / por \
    ETECTION_PATH = '{tu_ruta_raiz}/SCDOTR/SCDOTR-vLite/detected/productos.json'
   ```
3. Ejecuta el programa principal:
  ```shell
    python3 __main__.py
  ```
4. Para la versión Pro, asegúrate de tener objetos previamente etiquetados en la base de datos. La versión Lite solo detecta productos de Coca-Cola.

**Productos detectados:**

- Versión Pro: ["Rockaleta","Pikaros","Chocorroles","Galletas principe","Sabritas adobadas","Cheetos","Canelitas","Chocolate kinder","Coca-cola mediana","Coca-cola chica"]
- Versión Lite: ["Coca-cola mediana","Coca-cola chica"]
  
 Nota: Se debe colocar los productos en una superficie blanca para una mejor detección.
 
## Créditos

El proyecto SCDOTR ha sido desarrollado por:

- [Jesús Hernández](https://github.com/JesusHT)
- [Jairo Preciado](https://github.com/JairoPreciado)
- [Nadia Michelle](https://github.com/NadiaMichelle)
- [Fátima Marín](https://github.com/fmarin0)

Siéntete libre de visitar sus perfiles de GitHub para conocer más sobre sus contribuciones.

## Licencia

Este proyecto se distribuye bajo la [Licencia Pública General de GNU]. Consulta el archivo `LICENSE` para más detalles.




