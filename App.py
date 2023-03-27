import tkinter as tk
from tkinter import ttk
from queries import *

class App(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("SCDORT")
        
        # Configurar el tamaño mínimo de la ventana
        self.minsize(500, 300)
        
        # Configurar el grid
        self.grid_columnconfigure(0, weight=1)
        self.grid_rowconfigure(1, weight=1)
        
        # Crear la barra de búsqueda
        self.search_var = tk.StringVar()
        self.search_var.trace("w", self.update_search)
        self.search_entry = ttk.Entry(self, textvariable=self.search_var)
        self.search_entry.grid(row=0, column=3, padx=5, pady=5, sticky="nsew")

        # Botón para añadir proveedor
        self.add_provider_button = ttk.Button(self, text="Añadir proveedor", command=self.add_provider)
        self.add_provider_button.grid(row=0, column=0, padx=5, pady=5, sticky="nsew")

        # Botón para editar proveedor
        self.edit_provider_button = ttk.Button(self, text="Editar proveedor", command=self.edit_provider)
        self.edit_provider_button.grid(row=0, column=1, padx=5, pady=5, sticky="nsew")

        # Botón para escanear objetos
        self.scan_objects_button = ttk.Button(self, text="Escanear objetos", command=self.scan_objects)
        self.scan_objects_button.grid(row=0, column=2, padx=5, pady=5, sticky="nsew")

        # Crear el widget de tabla para mostrar los resultados
        columns = ("Nombre", "Proveedor", "Telefono", "Cantidad", "Precio")
        self.treeview = ttk.Treeview(self, columns=columns, show="headings", selectmode="browse")

        # Configurar las columnas de la tabla
        self.treeview.column("Nombre", width=100, minwidth=50, anchor=tk.CENTER)
        self.treeview.column("Proveedor", width=200, minwidth=100, anchor=tk.CENTER)
        self.treeview.column("Telefono", width=200, minwidth=100, anchor=tk.CENTER)
        self.treeview.column("Cantidad", width=100, minwidth=50, anchor=tk.CENTER)
        self.treeview.column("Precio", width=100, minwidth=50, anchor=tk.CENTER)

        # Configurar las cabeceras de las columnas
        for col in columns:
            self.treeview.heading(col, text=col)

        self.treeview.grid(row=1, column=0, columnspan=4, padx=5, pady=5, sticky="nsew")

        # Mostrar todos los productos al iniciar la aplicación
        self.show_all_products()
        
        # Configurar el resize de la ventana
        self.grid_rowconfigure(1, weight=1)
        self.grid_columnconfigure(0, weight=1)
        self.grid_columnconfigure(1, weight=1)
        self.grid_columnconfigure(2, weight=1)
        self.grid_columnconfigure(3, weight=1)
        self.treeview.grid(row=1, column=0, columnspan=4, padx=5, pady=5, sticky="nsew")
        self.search_entry.grid(row=0, column=3, padx=5, pady=5, sticky="nsew")
        self.add_provider_button.grid(row=0, column=0, padx=5, pady=5, sticky="nwsew")
        self.edit_provider_button.grid(row=0, column=1, padx=5, pady=5, sticky="nsew")

    def update_search(self, *args):
        # Obtener el término de búsqueda
        search_term = self.search_var.get()

        # Si el término de búsqueda está vacío, mostrar todos los productos
        if not search_term:
            self.show_all_products()
            return

        # Realizar la búsqueda
        results = searchProduct(search_term)

        # Limpiar la tabla de resultados anteriores
        self.treeview.delete(*self.treeview.get_children())

        # Mostrar los resultados en la tabla
        if results:
            for result in results:
                self.treeview.insert("", tk.END, values=result)
        else:
            self.treeview.insert("", tk.END, values=("No existe producto o proveedor con ese nombre.", "", "", "", ""))

    def show_all_products(self):
        # Obtener todos los productos
        results = getAllProducts()

        # Limpiar la tabla de resultados anteriores
        self.treeview.delete(*self.treeview.get_children())

        # Mostrar los resultados en la tabla
        if results:
            for result in results:
                self.treeview.insert("", tk.END, values=result)
        else:
            self.treeview.insert("", tk.END, values=("No hay productos.", "", "", "", ""))

    def add_provider(self):
        # Aquí iría el código para añadir un proveedor
        print("Añadir proveedor")
        pass

    def edit_provider(self):
        # Aquí iría el código para editar un proveedor
        print("Editar proveedor")
        pass

    def scan_objects(self):
        # Aquí iría el código para escanear objetos
        print("Escaneando...")
        pass

    def edit_product(self, product_id):
        # Aquí iría el código para editar un producto con el ID especificado
        print("Editar producto con ID:", product_id)


if __name__ == "__main__":
    app = App()
    app.mainloop()