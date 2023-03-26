import tkinter as tk
import tkinter.ttk as ttk
from TomarFotos import *
from queries import *

# Crea la interfaz de usuario
root = tk.Tk()
root.title("SCDORT")

# Establece el icono de la aplicación
icon_image = tk.PhotoImage(file="./resources/Logo.png")

# Establece el icono de la aplicación
root.iconphoto(False, icon_image)

# Configura la ventana para que se ajuste al tamaño de los widgets
root.columnconfigure(0, weight=1)
root.rowconfigure(0, weight=1)

def get_products():
    results = show_products()

    # Borra los datos existentes de la tabla de contactos
    for row in contact_table.get_children():
        contact_table.delete(row)

    # Agrega los resultados a la tabla de contactos
    for result in results:
        contact_table.insert("", tk.END, values=result)

# Crea la tabla de contactos
contact_table = ttk.Treeview(root, columns=("id", "name", "email"), show="headings")
contact_table.heading("id", text="ID Producto")
contact_table.heading("name", text="Nombre del producto")
contact_table.heading("email", text="Cantidad")
contact_table.grid(row=0, column=0, sticky="nsew", padx=5, pady=5)

# Agrega un botón para mostrar los contactos
show_button = ttk.Button(root, text="Mostrar contactos", command=get_products)
show_button.grid(row=1, column=0, sticky="ew", padx=5, pady=5)
show_button = ttk.Button(root, text="Capturar nuevo objeto", command=takeProductPhotos)
show_button.grid(row=2, column=0, sticky="ew", padx=5, pady=5)

# Inicia la aplicación
root.mainloop()