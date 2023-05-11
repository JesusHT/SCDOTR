const productos = {
    elementos : {
        id : document.getElementById("id"),
        nombre : document.getElementById("nombre"),
        descripcion : document.getElementById("descripcion"),
        precio : document.getElementById("precio"),
        existencias : document.getElementById("existencias"),
        idProvedor : document.getElementById("proveedor"),
        idProvedorAdd : document.getElementById("proveedor-insert"),
        modal : document.getElementById("modal"),
        modal2 : document.getElementById("modal2"),
        formUpdate : document.getElementById("formUpdate"),
        formInsert : document.getElementById("formInsert"),
        errors : document.getElementById("errors"),
        errors2 : document.getElementById("errors2"),
        table_products : document.getElementById("table-products"),
        search : document.getElementById("search")
    },

    obtenerProducto : function (idProducto) {
        fetch(`/productos/${idProducto}`)
            .then(response => response.json())
            .then(data => { 
                // Ingresar los proveedores
                let selectedProveedorId = data[0][4];
                let options = "";
                            
                data[1].forEach(proveedor => {
                  let selected = proveedor[0] == selectedProveedorId ? "selected" : "";
                  options += `<option value="${proveedor[0]}" ${selected}>${proveedor[1]}</option>`;
                });

                // Rellenar los campos del formulario con los datos del producto
                this.elementos.id.value = data[0][0];
                this.elementos.nombre.value = data[0][1];
                this.elementos.descripcion.value = data[0][2];
                this.elementos.precio.value = data[0][3];
                this.elementos.existencias.value = data[0][5];
                this.elementos.idProvedor.innerHTML = options;
                        
                // Mostrar el modal
                this.elementos.modal.style.display = "block";
        });
    },

    updateProducto : function(){
        const formData = new FormData(this.elementos.formUpdate);

        fetch('/editar', {
            method: 'POST',
            body: formData
        }).then(response => response.json())
            .then(data => {
                if (data == true) {
                    alert("Actualizado correctamente.");
                    views.load("/productos");
                } else {
                    this.elementos.errors.innerHTML = '';
                    const errorList = data.map(error => `<li>${error}</li>`).join('');
                    this.elementos.errors.innerHTML = errorList;
                }
        }).catch(error => { console.error(error);});
    },

    deleteProduct : async function(idProducto) {
        try {
            const response = await fetch(`/productos/contar/${idProducto}`);
            const data = await response.json();
            
            const message = data != false ? `¿Desea eliminar este producto? Usted tiene ${data} producto/s en stock, la acción es irreversible. Escriba CONFIRMAR para confirmar la acción:` 
                                      : "¿Desea eliminar este producto? La acción es irreversible. Escriba CONFIRMAR para confirmar la acción:" ;

            const confirmation = prompt(message);
          
            if (confirmation === "CONFIRMAR") {
                const deleteResponse = await fetch(`/productos/eliminar/${idProducto}`);
                
                if (deleteResponse.ok) {
                    alert("Borrado correctamente.");
                    views.load("/productos");
                }
            }
            
        }catch(error){ console.error(error); }
    },

    getProductsAll : function(){
        fetch('/productos/all').then(response => response.json())
            .then(data => {
                let html = '';
                for (var i = 0; i < data.length; i++) {
                    html += `
                        <tr>
                            <td>${data[i][0]}</td>
                            <td>${data[i][1]}</td>
                            <td>${data[i][2]}</td>
                            <td>$${data[i][3]}</td>
                            <td>${data[i][6]}</td>
                            <td>${data[i][5]}</td>
                            <td>
                              <button type="button" onclick="productos.obtenerProducto(${data[i][0]})">Editar</button>
                              <button type="button" class="btn btn-danger" onclick="productos.deleteProduct(${data[i][0]})" >Eliminar</button>
                            </td>
                        </tr>`;
                }

                this.elementos.table_products.innerHTML = html;
        }).catch(error => { console.error(error);});
    },

    setProducto : function (){
        const form = new FormData(this.elementos.formInsert);

        fetch('/productos/add', {
            method: 'POST',
            body : form
        }).then(response => response.json())
            .then(data => {
                if (data == true) {
                    alert("Agregado correctamente.");
                    views.load("/productos");
                } else {
                    this.elementos.errors.innerHTML = '';
                    const errorList = data.map(error => `<li>${error}</li>`).join('');
                    this.elementos.errors2.innerHTML = errorList;
                }
            }).catch(error => {console.error(error)});
    },

    openModalAdd : function(){
        fetch('/proveedores/obtener')
            .then(response => response.json())
            .then(data => {
                let html = '<option value="0" disabled selected>Elige un proveedor<option>';
                
                data.forEach(proveedor => {
                    html += `<option value="${proveedor[0]}">${proveedor[1]}</option>`;
                });

                this.elementos.idProvedorAdd.innerHTML = html
                this.elementos.modal2.style.display = "block";
            }).catch(error => {console.error(error)});
    },

    cerrarModal : function(element){
        document.getElementById(element).style.display = "none";
    },

    clearModal : function(){
        this.elementos.formUpdate.reset();
        this.elementos.idProvedor.innerHTML = "";
    }
}

productos.getProductsAll();

productos.elementos.search.addEventListener("input", () => {
    search = productos.elementos.search.value;

    if (search != '') {
        fetch(`/productos/buscar/${search}`)
            .then(response => response.json())
            .then(data => { 
                let html = '';
                if (data.length === 0) {
                    html = `
                        <tr>
                            <td colspan="7">No hay resultados con tus criterios de busqueda.</td>
                        </tr>`;
                } else {
                    for (var i = 0; i < data.length; i++) {
                        html += `
                            <tr>
                                <td>${data[i][0]}</td>
                                <td>${data[i][1]}</td>
                                <td>${data[i][2]}</td>
                                <td>$${data[i][3]}</td>
                                <td>${data[i][6]}</td>
                                <td>${data[i][5]}</td>
                                <td>
                                  <button type="button" onclick="productos.obtenerProducto(${data[i][0]})">Editar</button>
                                  <button type="button" class="btn btn-danger" onclick="productos.deleteProduct(${data[i][0]})" >Eliminar</button>
                                </td>
                            </tr>`;
                    }   
                }

                productos.elementos.table_products.innerHTML = html;
        });
    } else {
        productos.getProductsAll();
    }
});