#!/bin/bash

echo Se instalaran todas las librerias necesarias para el proyecto SCDOTR

sleep 1s

cd /home/$USER

sudo apt-get update

sudo apt-get upgrade

sudo apt-get install python3-tk

sudo apt-get install python3-opencv

sudo apt-get install libopencv-dev

sudo apt-get install python3-mysql.connector

sudo apt-get install python3-numpy
