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
            .then(responese => responese.json())
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
                              <button type="button" class="btn btn-danger" onclick="preoveedores.deleteProveedor(${data[i][0]})" >Eliminar</button>
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

                console.log(data)

                this.elementos.id.value           = data[0];
                this.elementos.nameEmpresa.value  = data[1];
                this.elementos.nameContacto.value = data[2];
                this.elementos.telefono.value     = data[3];
                this.elementos.email.value        = data[4];

                this.elementos.modalUpdate.style.display = "block";
            }).catch(error => { console.error(error) });
    },

    setProveedor : function (){

    },

    updateProveedor : function (idProveedor){

    },

    deleteProveedor : async function(idProveedor){

    },

    closeModal : function(elemento){
        document.getElementById(elemento).style.display = "none";
    },

    openModal : function(){
        this.elementos.modalInsert.style.display = "block";
    }
}

proveedores.getProveedoresAll();