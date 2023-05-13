import re

class ValidateData:
    def __init__(self):
        self.errors = []

    def validar_producto(self, data_dict):
        self.errors = []

        for key, value in data_dict.items():
            if key == 'id' and not value.isdigit():
                self.errors.append(f"El valor {value} para la columna {key} no es un entero válido")
            elif key in ('nombre', 'descripcion') and not re.match("^[A-Za-z0-9 ,.\-'áéíóúÁÉÍÓÚñÑ]+$", value)  and value != '':
                self.errors.append(f"El valor {value} para la columna {key} contiene caracteres no permitidos")
            elif key == 'precio' and not re.match("^[0-9]+(\.[0-9]{1,2})?$", value)  and value != '':
                self.errors.append(f"El valor {value} para la columna {key} no es un decimal válido")
            elif key in ('proveedor_id', 'existencias') and not value.isdigit() and value != '':
                self.errors.append(f"El valor {value} para la columna {key} no es un entero válido")
            elif value == '':
                self.errors.append(f"El valor para la columna {key} está vacío")

        if len(self.errors) > 0:
           return self.errors

        return True

    def validar_proveedor(self, data_dict):
        self.errors = []

        for key, value in data_dict.items():
            if key == 'id' and not value.isdigit():
                self.errors.append(f"El valor {value} para la columna {key} no es un entero válido")
            elif key == 'nombre_empresa' and not re.match("^[A-Za-z0-9 ,.-]+$", value) and value != '':
                self.errors.append(f"El valor {value} para la columna {key} contiene caracteres no permitidos")
            elif key == 'nombre_contacto' and not re.match("^[A-Za-z ,.-]+$", value) and value != '':
                self.errors.append(f"El valor {value} para la columna {key} contiene caracteres no permitidos")
            elif key == 'telefono' and not re.match("^[0-9-]+$", value) and value != '':
                self.errors.append(f"El valor {value} para la columna {key} no es un teléfono válido")
            elif key == 'email' and not re.match("^[^@]+@[^@]+\.[^@]+$", value) and value != '':
                self.errors.append(f"El valor {value} para la columna {key} no es un correo electrónico válido")
            elif value == '':
                self.errors.append(f"El valor para la columna {key} está vacío")

        if len(self.errors) > 0:
           return self.errors

        return True
