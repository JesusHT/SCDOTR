const proveedores = {
    elementos : {
        tableProveedores : document.getElementById("table-proveedores"),
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
                              <button type="button" class="btn btn-info text-white"   onclick="Template_modal.openModalProveedores(${data[i][0]})"><i class="bi bi-pencil-square"></i></button>
                              <button type="button" class="btn btn-danger" onclick="proveedores.deleteProveedor(${data[i][0]})" ><i class="bi bi-trash3-fill"></i></button>
                            </td>
                        </tr>`;
                }

                this.elementos.tableProveedores.innerHTML = html;
            }).catch(error => { console.error(error);});
    },

    setProveedor : function (){
        formData = new FormData(document.getElementById("form-proveedores"));

        fetch('/proveedores/agregar', {
            method: 'POST',
            body : formData
        }).then(response => response.json())
            .then(data => {
                if (data == true) {
                    alert("Agregado proveedor correctamente.");
                    views.load("/proveedores");
                } else {
                    Template_modal.loadErrors(data);
                }
            }).catch(error => {console.error(error);});
    },

    updateProveedor : function (){
        formData = new FormData(document.getElementById("form-proveedores"));

        fetch('/proveedores/actualizar', {
            method: 'POST',
            body: formData
        }).then(response => response.json())
            .then(data => {
                if (data == true) {
                    alert("Actualizado correctamente.");
                    views.load("/proveedores");
                } else {
                    Template_modal.loadErrors(data);
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
                                  <button type="button" class="btn btn-info text-white"   onclick="Template_modal.openModalProveedores(${data[i][0]})"><i class="bi bi-pencil-square"></i></button>
                                  <button type="button" class="btn btn-danger" onclick="proveedores.deleteProveedor(${data[i][0]})" ><i class="bi bi-trash3-fill"></i></button>
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