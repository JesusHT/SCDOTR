const productos = {
    elementos : {
        table_products : document.getElementById("table-products"),
        search         : document.getElementById("search")
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
                              <button type="button" class="btn btn-info"   onclick="Template_modal.openModalProductos(${data[i][0]})">Editar</button>
                              <button type="button" class="btn btn-danger" onclick="productos.deleteProduct(${data[i][0]})" >Eliminar</button>
                            </td>
                        </tr>`;
                }

                this.elementos.table_products.innerHTML = html;
        }).catch(error => { console.error(error);});
    },

    setProducto : function (){
        const form = new FormData(document.getElementById('form-productos'));

        fetch('/productos/add', {
            method: 'POST',
            body : form
        }).then(response => response.json())
            .then(data => {
                if (data == true) {
                    alert("Agregado correctamente.");
                    views.load("/productos");
                } else {
                    Template_modal.loadErrors(data);
                }
            }).catch(error => {console.error(error)});
    },

    updateProducto : function(){
        const formData = new FormData(document.getElementById('form-productos'));

        fetch('/editar', {
            method: 'POST',
            body: formData
        }).then(response => response.json())
            .then(data => {
                if (data == true) {
                    alert("Actualizado correctamente.");
                    views.load("/productos");
                } else {
                    Template_modal.loadErrors(data);
                }
        }).catch(error => { console.error(error);});
    },

    deleteProduct : async function(idProvedor) {
        try {
            const response = await fetch(`/proveedores/contar/${idProvedor}`);
            const data = await response.json();
            
            const message = data != false ? `¿Desea eliminar este producto? Usted tiene ${data} producto/s en stock, la acción es irreversible. Escriba CONFIRMAR para confirmar la acción:` 
                                      : "¿Desea eliminar este producto? La acción es irreversible. Escriba CONFIRMAR para confirmar la acción:" ;

            const confirmation = prompt(message);
          
            if (confirmation === "CONFIRMAR") {
                const deleteResponse = await fetch(`/productos/eliminar/${idProvedor}`);
                
                if (deleteResponse.ok) {
                    alert("Borrado correctamente.");
                    views.load("/productos");
                }
            }
            
        } catch(error){ console.error(error); }
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
                                  <button type="button" class="btn btn-info"   onclick="Template_modal.openModalProductos(${data[i][0]})">Editar</button>
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