const Template_modal = {
    proveedores : [],
    producto    : [],
    proveedor   : [],

    openModalProductos : async function(idProducto = ''){
        let options = "";

        if (idProducto != '') {
            const response = await fetch(`/productos/${idProducto}`);
            const producto = await response.json();
    
            let selectedProveedorId = producto[0][4];
            this.producto = producto[0];
    
            this.proveedores.forEach(proveedor => {
                let selected = proveedor[0] == selectedProveedorId ? "selected" : "";
                options += `<option value="${proveedor[0]}" ${selected}>${proveedor[1]}</option>`;
            });
        } else {
            this.proveedores.forEach(proveedor => {
                options += `<option value="${proveedor[0]}">${proveedor[1]}</option>`;
            });
        }
        
        const {producto: [,name, description, price, ,stock]} = this;
        const isNewProducto = idProducto == '';
        const data = {
            campos: {
                id          : idProducto,
                name        : isNewProducto ? '' : name,
                description : isNewProducto ? '' : description,
                price       : isNewProducto ? '' : price,
                stock       : isNewProducto ? '' : stock,
                proveedores : options
            },
            config: {
                title : isNewProducto ? 'Nuevo Producto'          : 'Editar Producto',
                func  : isNewProducto ? 'productos.setProducto()' : 'productos.updateProducto()'
            }
        };


        this.loadTemplateModalProductos(data);
    },
    
    openModalProveedores : async function(idProveedor = ''){

        if (idProveedor !== '') {
            const response  = await fetch(`/proveedores/${idProveedor}`);
            const proveedor = await response.json();

            this.proveedor = proveedor;
        }

        const {proveedor: [, name_empresa, name_contacto, telefono, email]} = this;
        const isNewProveedor = idProveedor == '';

        const data = {
            campos : {
                id            : idProveedor,
                name_empresa  : isNewProveedor ? '' : name_empresa,
                name_contacto : isNewProveedor ? '' : name_contacto,
                telefono      : isNewProveedor ? '' : telefono,
                email         : isNewProveedor ? '' : email
            },
            config : {
                title  : isNewProveedor ? 'Nuevo proveedor'            : 'Editar proveedor',
                func   : isNewProveedor ? 'proveedores.setProveedor()' : 'proveedores.updateProveedor()'
            }
        };


        this.loadTemplateModalProveedores(data);
    },

    loadTemplateModalProductos : function(data){
        const {campos, config} = data;

        let html = `
                <div id="modal" class="modal">
                    <div class="modal-content">
                        <div><ul id="errors"></ul></div>
                        <h2>${config.title}</h2>
                        <form id="form-productos">
                            
                            <label for="nombre">Nombre:</label>
                            <input type="text" id="nombre" name="nombre" value="${campos.name}" required><br><br>

                            <label for="descripcion">Descripción:</label>
                            <input type="text" id="descripcion" name="descripcion" value="${campos.description}" required><br><br>
                            
                            <label for="precio">Precio:</label>
                            <input type="text" id="precio" name="precio" value="${campos.price}" required ><br><br>
                            
                            <label for="existencias">Existencias:</label>
                            <input type="number" id="existencias" name="existencias" value="${campos.stock}" required><br><br>
                            
                            <label for="proveedores">Proveedor:</label>
                            <select id="proveedores" name="proveedor_id" required>
                                ${campos.proveedores}
                            </select><br><br>
                            <input type="hidden" id="id" name="id" value="${campos.id}">

                            <button type="button" onclick="${config.func}">Guardar</button>
                            <button type="button" onclick="Template_modal.closedModal()">Cancelar</button>
                        </form>
                    </div>
                </div>
        `;

        document.getElementById('container-modal').innerHTML = html;
        document.getElementById('modal').style.display = 'block';
    },

    loadTemplateModalProveedores : function(data){
        const {campos, config} = data;

        let html = `
            <div id="modal" class="modal">
                <div class="modal-content">
                    <div><ul id="errors"></ul></div>
                    <h2>${config.title}</h2>
                    <form id="form-proveedores">
                        <input type="hidden" id="id" name="id" value="${campos.id}">

                        <label for="name-empresa">Nombre de la empresa:</label>
                        <input type="text" id="name-empresa" name="name-empresa" value="${campos.name_empresa}" required><br><br>

                        <label for="name-contacto">Nombre de contacto:</label>
                        <input type="text" id="name-contacto" name="name-contacto" value="${campos.name_contacto}" required><br><br>

                        <label for="telefono">Teléfono:</label>
                        <input type="tel" id="telefono" name="telefono" value="${campos.telefono}"} required><br><br>

                        <label for="email">Email:</label>
                        <input type="email" id="email" name="email" value="${campos.email}" required>

                        <br><br>
                        <button type="button" onclick="${config.func}">Guardar</button>
                        <button type="button" onclick="Template_modal.closedModal()">Cancelar</button>
                    </form>
                </div>
            </div>
        `;

        document.getElementById('container-modal').innerHTML = html;
        document.getElementById('modal').style.display = 'block';
    },

    loadErrors : function(errors){
        document.getElementById("errors").innerHTML = '';
        const errorList = errors.map(error => `<li>${error}</li>`).join('');
        document.getElementById("errors").innerHTML = errorList;
    },

    closedModal : function(){
        document.getElementById('modal').style.display = 'none';
        document.getElementById('container-modal').innerHTML = '';
    },

    getProveedores : function(){
        fetch('/proveedores/obtener')
            .then(response => response.json())
            .then(data => {
                this.proveedores = data;

            }).catch(error => {console.error(error)});
    }
}

if (!window.location.href.includes('/proveedores')) {
    Template_modal.getProveedores();
}