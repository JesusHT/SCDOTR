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
                        <div id="error-list" class="alert alert-danger rounded" role="alert" style="display:none;"><ul id="errors"></ul></div>
                        <h2 class="text-center">${config.title}</h2>
                        <form id="form-productos" class="form-floating">

                            <div class="form-floating mb-2">
                                <input type="text" class="form-control w-100" id="nombre" name="nombre" value="${campos.name}"  placeholder="Nombre" required>
                                <label for="nombre">Nombre</label>
                            </div>

                            <div class="form-floating mb-2">
                                <input type="text" class="form-control w-100" id="descripcion" placeholder="Descripcion" name="descripcion" value="${campos.description}" required>
                                <label for="descripcion">Descripción: </label>
                            </div>
                            
                            <div class="form-floating mb-2">
                                <input type="number" class="form-control w-100" id="precio" name="precio" value="${campos.price}" placeholder="Precio" required>
                                <label for="precio">Precio</label>
                            </div>

                            <div class="form-floating mb-2">
                                <input type="number" class="form-control w-100" id="existencias" placeholder="Existencias" name="existencias" value="${campos.stock}" required>
                                <label for="existencias">Existencias</label>
                            </div>
                            
                            <div class="form-floating mb-2">
                                <select class="form-select w-100" id="proveedores" aria-label="Proveedores" name="proveedor_id" required>
                                    ${campos.proveedores}
                                </select>
                                <label for="proveedores">Proveedores</label>
                            </div>
                            
                            <input type="hidden" id="id" name="id" value="${campos.id}">

                            <div align="right">
                                <button class="btn btn-danger"  type="button" onclick="Template_modal.closedModal()">Cancelar</button>
                                <button class="btn btn-success" type="button" onclick="${config.func}">Guardar</button>
                            </div>
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
                    <div id="error-list" class="alert alert-danger" role="alert" style="display:none;"><ul id="errors"></ul></div>
                    <h2 class="text-center">${config.title}</h2>
                    <form id="form-proveedores" class="form-floating">
                    
                        <input type="hidden" id="id" name="id" value="${campos.id}">

                        <div class="form-floating mb-2">
                            <input type="text" class="form-control w-100" id="name-empresa" placeholder="name-empresa" name="name-empresa" value="${campos.name_empresa}" required>
                            <label for="name-empresa">Empresa: </label>
                        </div>

                        <div class="form-floating mb-2">
                            <input type="text" class="form-control w-100" id="name-contacto" placeholder="name-contacto" name="name-contacto" value="${campos.name_contacto}" required>
                            <label for="name-contacto">Contacto: </label>
                        </div>

                        <div class="form-floating mb-2">
                            <input type="tel" class="form-control w-100" id="telefono" placeholder="Telefono" name="telefono" value="${campos.telefono}" required>
                            <label for="telefono">Telefono: </label>
                        </div>

                        <div class="form-floating mb-2">
                            <input type="email" class="form-control w-100" id="email" placeholder="Email" name="email" value="${campos.email}" required>
                            <label for="email">Email: </label>
                        </div>

                        <div align="right">
                            <button type="button" class="btn btn-danger" onclick="Template_modal.closedModal()">Cancelar</button>
                            <button type="button" class="btn btn-success"  onclick="${config.func}">Guardar</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.getElementById('container-modal').innerHTML = html;
        document.getElementById('modal').style.display = 'block';
    },

    loadErrors : function(errors){
        document.getElementById("error-list").style.display = 'block';
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