import tkinter as tk
import tkinter.ttk as ttk
from conexion import conectar

# Conecta a la base de datos
db = conectar()

# Crea una función para mostrar contactos
def show_contacts():
    # Crea un cursor para ejecutar consultas SQL
    cursor = db.cursor()

    # Ejecuta la consulta SQL para mostrar todos los contactos
    sql = "SELECT id, name, email FROM cliente"
    cursor.execute(sql)

    # Obtiene todos los resultados de la consulta
    results = cursor.fetchall()

    # Borra los datos existentes de la tabla de contactos
    for row in contact_table.get_children():
        contact_table.delete(row)

    # Agrega los resultados a la tabla de contactos
    for result in results:
        contact_table.insert("", tk.END, values=result)

# Crea la interfaz de usuario
root = tk.Tk()
root.title("Agenda de contactos")

# Establece el icono de la aplicación
icon_image = tk.PhotoImage(file="./resources/logo.png")

# Establece el icono de la aplicación
root.iconphoto(False, icon_image)

# Configura la ventana para que se ajuste al tamaño de los widgets
root.columnconfigure(0, weight=1)
root.rowconfigure(0, weight=1)

# Crea la tabla de contactos
contact_table = ttk.Treeview(root, columns=("id", "name", "email"), show="headings")
contact_table.heading("id", text="ID")
contact_table.heading("name", text="Nombre")
contact_table.heading("email", text="Correo electrónico")
contact_table.grid(row=0, column=0, sticky="nsew", padx=5, pady=5)

# Agrega un botón para mostrar los contactos
show_button = ttk.Button(root, text="Mostrar contactos", command=show_contacts)
show_button.grid(row=1, column=0, sticky="ew", padx=5, pady=5)

# Inicia la aplicación
root.mainloop()