const productos = {
    elemetos : {
        id : document.getElementById("id"),
        nombre : document.getElementById("nombre"),
        descripcion : document.getElementById("descripcion"),
        precio : document.getElementById("precio"),
        existencias : document.getElementById("existencias"),
        idProvedor : document.getElementById("proveedor"),
        modal : document.getElementById("modal"),
        form : document.getElementById("formUpdate")
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
                this.elemetos.id.value = data[0][0];
                this.elemetos.nombre.value = data[0][1];
                this.elemetos.descripcion.value = data[0][2];
                this.elemetos.precio.value = data[0][3];
                this.elemetos.existencias.value = data[0][5];
                this.elemetos.idProvedor.innerHTML = options;
                        
                // Mostrar el modal
                this.elemetos.modal.style.display = "block";
        });
    },

    cerrarModal : function(){
        this.elemetos.modal.style.display = "none";
    },

    clearModal : function(){
        this.elemetos.form.reset();
        this.elemetos.idProvedor.innerHTML = "";
    }
}