const proveedores = {
    elementos : {
        errorsUpdate     : document.getElementById("errors-update"),
        errorsInsert     : document.getElementById("errors-insert"),

        formUpdate       : document.getElementById("form-update"),
        formInsert       : document.getElementById("form-insert"),
        
        modalUpdate      : document.getElementById("modal-update"),
        modalInsert      : document.getElementById("modal-insert"),

        tableProveedores : document.getElementById("table-proveedores"),

        id               : document.getElementById("id"),
        nameEmpresa      : document.getElementById("name-empresa"),
        nameContacto     : document.getElementById("name-contacto"),
        telefono         : document.getElementById("telefono"),
        email            : document.getElementById("email"),

        search           : document.getElementById("search")
    },

    getProveedoresAll : function (){
        fetch('/proveedores/obtener')
            .then(response => response.json())
            .then(data => {
                let html = '';

                for (let i = 0; i < data.length; i++) {
                    html += `
                        <tr>
                            <td>${data[i][0]}</td>
                            <td>${data[i][1]}</td>
                            <td>${data[i][2]}</td>
                            <td>${data[i][3]}</td>
                            <td>${data[i][4]}</td>
                            <td>
                              <button type="button" onclick="proveedores.getProveedoresById(${data[i][0]})">Editar</button>
                              <button type="button" class="btn btn-danger" onclick="proveedores.deleteProveedor(${data[i][0]})" >Eliminar</button>
                            </td>
                        </tr>`;
                }

                this.elementos.tableProveedores.innerHTML = html;
            }).catch(error => { console.error(error);});
    },

    getProveedoresById : function (id_proveedor){
        fetch(`/proveedores/${id_proveedor}`)
            .then(response => response.json())
            .then(data => {

                this.elementos.id.value           = data[0];
                this.elementos.nameEmpresa.value  = data[1];
                this.elementos.nameContacto.value = data[2];
                this.elementos.telefono.value     = data[3];
                this.elementos.email.value        = data[4];

                this.elementos.modalUpdate.style.display = "block";
            }).catch(error => { console.error(error) });
    },

    setProveedor : function (){
        formData = new FormData(this.elementos.formInsert);

        fetch('/proveedores/agregar', {
            method: 'POST',
            body : formData
        }).then(response => response.json())
            .then(data => {
                if (data == true) {
                    alert("Agregado proveedor correctamente.");
                    views.load("/proveedores");
                } else {
                    this.elementos.formInsert.reset();
                    this.elementos.errorsInsert.innerHTML = '';
                    const errorList = data.map(error => `<li>${error}</li>`).join('');
                    this.elementos.errorsInsert.innerHTML = errorList;
                }
            }).catch(error => {console.error(error);});
    },

    updateProveedor : function (){
        formData = new FormData(this.elementos.formUpdate);

        fetch('/proveedores/actualizar', {
            method: 'POST',
            body: formData
        }).then(response => response.json())
            .then(data => {
                if (data == true) {
                    alert("Actualizado correctamente.");
                    views.load("/proveedores");
                } else {
                    this.elementos.formUpdate.reset();
                    this.elementos.errorsUpdate.innerHTML = '';

                    const errorList = data.map(error => `<li>${error}</li>`).join('');
                    this.elementos.errorsUpdate.innerHTML = errorList;
                }
        }).catch(error => { console.error(error);});
    },

    deleteProveedor : async function(idProveedor){
        const response = await fetch(`/proveedores/contar/${idProveedor}`);
        const data = await response.json();
            
        const message = data != false ? `¿Desea eliminar este proveedor? Usted tiene ${data} producto/s que usan este proveedor que se borraran, la acción es irreversible. Escriba CONFIRMAR para confirmar la acción:` 
                                      : "¿Desea eliminar este proveedor? La acción es irreversible. Escriba CONFIRMAR para confirmar la acción:" ;

        const confirmation = prompt(message);
          
        if (confirmation === "CONFIRMAR") {
                const deleteResponse = await fetch(`/proveedores/eliminar/${idProveedor}`);
                
            if (deleteResponse.ok) {
                alert("Borrado correctamente.");
                views.load("/proveedores");
            }
        }
    },

    closeModal : function(elemento){
        document.getElementById(elemento).style.display = "none";
        this.elementos.errorsInsert.innerHTML = "";
        this.elementos.errorsUpdate.innerHTML = "";
        this.elementos.formInsert.reset();
        this.elementos.formUpdate.reset();
    },

    openModal : function(){
        this.elementos.modalInsert.style.display = "block";
    }
}

proveedores.getProveedoresAll();

proveedores.elementos.search.addEventListener("input", () => {
    search = proveedores.elementos.search.value;

    if (search != '') {
        fetch(`/proveedores/buscar/${search}`)
            .then(response => response.json())
            .then(data => { 
                let html = '';
                
                if (data.length === 0) {
                    html = `
                        <tr>
                            <td colspan="6">No hay resultados con tus criterios de busqueda.</td>
                        </tr>`;
                } else {
                    for (let i = 0; i < data.length; i++) {
                        html += `
                            <tr>
                                <td>${data[i][0]}</td>
                                <td>${data[i][1]}</td>
                                <td>${data[i][2]}</td>
                                <td>${data[i][3]}</td>
                                <td>${data[i][4]}</td>
                                <td>
                                  <button type="button" onclick="proveedores.getProveedoresById(${data[i][0]})">Editar</button>
                                  <button type="button" class="btn btn-danger" onclick="proveedores.deleteProveedor(${data[i][0]})" >Eliminar</button>
                                </td>
                            </tr>`;
                    }
    
                }
                proveedores.elementos.tableProveedores.innerHTML = html;
            });
    } else {
        proveedores.getProveedoresAll();
    }
});