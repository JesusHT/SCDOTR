const Cobro = {
    productos    : [],
    valuesTemp   : [],
    detecciones  : [],
    tempTicket   : [],
    tempProducts : [],
    IntervalID   : null,

    elementos : {
        video        : document.getElementById('video-stream'),
        product_list : document.getElementById('product-list'),
        detectar     : document.getElementById('detectar'),
        detener      : document.getElementById('detener'),
        form         : document.getElementById('form-cobro'),
        messages     : document.getElementById('messages')
    },

    getProductsAll : function(){
        fetch('/productos/all').then(response => response.json())
            .then(data => {
                this.formatData(data);
        }).catch(error => { console.error(error);});
    },

    detect : function(){
        fetch('/detect',{
            method : "POST",
            body   : ""
        }).then(response => response.json())
            .then(data => {
                if(data == true){
                    this.IntervalID = setInterval(this.getDetections, 3000);

                    this.elementos.detectar.style.display = 'none';
                    this.elementos.detener.style.display  = 'block';
                }
            }).catch(error => {console.error(error);})
    },

    stopDetect : function(){
        fetch('/stop_detect',{
            method : "POST",
            body   : ""
        }).then(response => response.json())
            .then(data => {
                if (data === true) {                    
                    clearInterval(this.IntervalID);
                    this.IntervalID = null;

                    this.elementos.detectar.style.display = 'block';
                    this.elementos.detener.style.display  = 'none';
                }
            }).catch(error => {console.error(error);})
    },

    loadProducts : function(data){
        this.detecciones = data.concat(this.tempProducts);
        this.elementos.product_list.innerHTML = '';
        let html  = ``;
        let total = 0;

        const keys = new Set(this.detecciones.map(key => key.names));

        this.productos.forEach(producto => {
            Object.keys(producto).filter(key => keys.has(key)).forEach(key => {
                const newKey = key.replace(/-/, '_');
                const index  = this.valuesTemp.findIndex(objeto => objeto.hasOwnProperty(newKey));
                const cant   = index !== -1 ? this.valuesTemp[index][newKey].value : 1;

                html += `
                        <div class="product mt-2" id="${newKey}-container">
                            <div class="name">${key.replace(/-/g, "_").replace(/_/g, " ")}</div>
                            <div class="price">${producto[key].Price}</div>
                            <div class="quantity">
                                <button type="button" class="btn-danger" onclick="Cobro.deleteProducto(${newKey})"><i class="bi bi-trash3"></i></button>
                                <button type="button" onclick="Cobro.decrementProducts(${newKey})">-</button>
                                <input type="text" id="${newKey}" name="${newKey}" value="${cant}">
                                <button type="button" onclick="Cobro.addProducts(${newKey})">+</button>
                            </div>
                        </div>`;

                total += (producto[key].Price * cant);
            });
        });


        html += `<hr class="mb-2" id="hr">
                 <div align="right" class="mt-2">
                    <label for="pago">Pago: </label>
                    <input type="number" name="pago" id="pago" required>
                    <br>
                    <label for="total"   id="label-total">Total: ${total}</label>
                    <input type="hidden" id="total" name="total" value="${total}">
                 </div>
                 <div class="mt-2" align="right">
                    <button type="button" class="btn btn-danger"  onclick="Cobro.resetCompra()">Cancelar</button>                 
                    <button type="button" class="btn btn-success" onclick="Cobro.payProduct()"><i class="bi bi-currency-dollar"></i></button>
                 </div>
                 `;

        this.elementos.product_list.innerHTML = html;
    },

    getDetections : function(){
        fetch('/get_detections')
            .then(response => response.json())
            .then(data => {
                Cobro.loadProducts(data);
             }).catch(error => {console.error(error);});
    },

    restartDetections : function() {
        fetch('/restart_detections')
            .then(response => response.json())
            .then(data => {})
        .catch(error => {console.error(error);});
    }, 

    formatData : function (data){

        this.productos = data.map(elemento => ({
            [elemento[1]]: {
                ID          : elemento[0],
                Description : elemento[2],
                Price       : elemento[3],
                IDsuppliers : elemento[4],
                Stock       : elemento[5],
                NameCompany : elemento[6]
            }
        }));
    }, 

    addProducts : function(element){
        if (element.value < 11) {
            element.value = parseInt(element.value) + 1;

            this.addTempValues(element.id, element.value);
            this.calNewTotal();
        }
    },

    decrementProducts : function(element){
        if (element.value > 1) {
            element.value = element.value - 1;
            
            this.addTempValues(element.id, element.value);
            this.calNewTotal();
        } 
    },

    addTempValues : function(ID, cant){
        const index = this.valuesTemp.findIndex(objeto => objeto.hasOwnProperty(ID));

        if (index !== -1) {
            this.valuesTemp[index][ID].value = cant;
        } else {
            this.valuesTemp.push({[ID]: { value: parseInt(cant)}});
        }
    },

    calNewTotal : function(){
        const textInputs = document.querySelectorAll('input[type="text"]');
        const label      = document.getElementById('label-total');
        const input      = document.getElementById('total');
        const prices      = [];

        let total = 0;

        this.productos.forEach(producto => {
            Object.keys(producto).forEach(key => {
                prices.push({
                    [key.replace(/-/, '_')]: {
                        price : producto[key].Price
                    }
                });
            });   
        });

        textInputs.forEach(elemento => {
            const index  = prices.findIndex(objeto => objeto.hasOwnProperty(elemento.id));

            if (index !== -1) {
                total += parseInt(document.getElementById(elemento.id).value) * prices[index][elemento.id].price;
            }
        })

        label.innerHTML = `Total: ${total}`;
        input.value     = total;
    },

    deleteProducto : function(product){
        let element = '';
        
        this.detecciones.forEach((producto, index) => {
            if (producto.names.replace(/-/, '_') === product.id) {
                element = producto.names.replace(/-/, '_');
                this.detecciones.splice(index, 1);
            }
        });

        const index = this.valuesTemp.findIndex(objeto => objeto.hasOwnProperty(product.id));
        if (index !== -1) {this.valuesTemp.splice(index, 1);}

        const json = JSON.stringify(this.detecciones);

        fetch('/nuevoproductos', {
            method: 'POST',
            body: json,
            headers: {'Content-Type': 'application/json'}
        }).then(response => response.json())
            .then(data => {
                if (data === true) {
                    document.getElementById(`${element}-container`).innerHTML = '';
                    document.getElementById(`${element}-container`).style.display = 'none';

                    this.calNewTotal();
                    this.existProducts();
                }
        }).catch(error => {console.error(error);});
    },

    deleteProductManual : function(product){
        let element = '';
        
        this.tempProducts.forEach((producto, index) => {
            if (producto.names.replace(/-/, '_') === product.id) {
                element = producto.names.replace(/-/, '_');
                this.tempProducts.splice(index, 1);
            }
        });

        const index = this.valuesTemp.findIndex(objeto => objeto.hasOwnProperty(product.id));
        if (index !== -1) {this.valuesTemp.splice(index, 1);}

        document.getElementById(`${element}-container`).innerHTML = '';
        document.getElementById(`${element}-container`).style.display = 'none';

        this.calNewTotal();
        this.existProducts();
    },

    existProducts : function(){
        const textInputs = document.querySelectorAll('input[type="text"]');
        if (textInputs.length === 0) { this.resetCompra();}
    },

    resetCompra : function(){
        this.valuesTemp   = [];
        this.detecciones  = [];
        this.tempProducts = '';
        this.elementos.product_list.innerHTML = '<img src="./../static/img/instrucciones.jpeg" class="img-fluid mt-3" alt="Instrucciones">';
        //this.restartDetections();
        this.elementos.messages.style.display = 'none';
        this.elementos.messages.innerHTML = '';
    },

    payProduct: async function () {
        const saldo = document.getElementById('pago');
        const total = document.getElementById('total');
        const textInputs = document.querySelectorAll('input[type="text"]');
      
        if (saldo.value == 0 || saldo.value == '' || parseFloat(total.value) > saldo.value) {
          saldo.classList.add('border', 'border-danger');
          return;
        } else {
          saldo.classList.remove('border-danger');
        }
      
        const validate = async function () {
            let isValid = true;
      
            for (const element of textInputs) {
                if (element.value > 12 || element.value < 1) {
                    element.classList.add('border', 'border-danger');
                    element.value = 1;
                    isValid = false;
                } else {
                    element.classList.remove('border-danger');
                }
            }
      
          return isValid;
        };
      
        if (!(await validate())) {return;}
      
        const data = new FormData(this.elementos.form);
      
        try {
            const response = await fetch('/pagarproductos', {
                method: 'POST',
                body: data
            });
      
            const responseData = await response.json();

            if (responseData[0][0] == 'True') {
                this.loadTicket(responseData[1]);
                this.tempTicket = responseData[1];
                this.resetCompra();
            } else {
                this.elementos.messages.style.display = 'block';
                this.elementos.messages.innerHTML = responseData[0][1];
            }

        } catch (error) { console.error(error);}
    },

    addProduct : function(){
        const value   = document.getElementById('IdProducto').value;

        if (isNaN(value) || value < 1 || value > 10){return;}

        const content = document.getElementById('hr');
        let html      = '';
        let precio    = 0;  

        for (let i = 0; i < this.productos.length; i++) {
            const objeto = this.productos[i];
            
            for (const key in objeto) {
                if (objeto[key].ID == value) {
                    const newKey = key.replace(/-/, '_');

                    html = `
                            <div class="product mt-2" id="${newKey}-container">
                                <div class="name">${key.replace(/-/g, "_").replace(/_/g, " ")}</div>
                                <div class="price">${objeto[key].Price}</div>
                                <div class="quantity">
                                    <button type="button" class="btn-danger" onclick="Cobro.deleteProductManual(${newKey})"><i class="bi bi-trash3"></i></button>
                                    <button type="button" onclick="Cobro.decrementProducts(${newKey})">-</button>
                                    <input type="text" id="${newKey}" name="${newKey}" value="1">
                                    <button type="button" onclick="Cobro.addProducts(${newKey})">+</button>
                                </div>
                            </div>`;

                    precio = objeto[key].Price;
                    this.tempProducts.push({ names: key });
                }
            }
        }

        if (content == null) {
            html += `<hr class="mb-2" id="hr">
                    <div align="right" class="mt-2">
                       <label for="pago">Pago: </label>
                       <input type="number" name="pago" id="pago" required>
                       <br>
                       <label for="total"   id="label-total">Total: ${precio}</label>
                       <input type="hidden" id="total" name="total" value="${precio}">
                    </div>
                    <div class="mt-2" align="right">
                       <button type="button" class="btn btn-danger"  onclick="Cobro.resetCompra()">Cancelar</button>                 
                       <button type="button" class="btn btn-success" onclick="Cobro.payProduct()"><i class="bi bi-currency-dollar"></i></button>
                    </div>`;


            this.elementos.product_list.innerHTML = html;
        } else {
            content.insertAdjacentHTML("beforebegin", html);
            this.calNewTotal();
        }

        document.getElementById('IdProducto').value = '';
    },

    loadTicket : function(Details){
        const content = document.getElementById('content-modal');
        let total     = 0;
        let html      = ``;
        let productos = ``;

        const calcularTotal = (details) => {
            return details.reduce((subtotal, { PrecioProducto, Descuento, Cantidad }) => {
                return subtotal + (parseFloat(PrecioProducto) * parseInt(Cantidad)) - parseFloat(Descuento);
            },0);
        };
    
        total = calcularTotal(Details);

        Details.forEach(({ PrecioProducto, Descuento, Cantidad, Nombre }) => {
            const subtotal = (PrecioProducto * Cantidad) - Descuento;
            
            productos += `<tr>
                              <td>${Nombre == 'Chetos' ? 'Cheetos' : Nombre.replace(/_/g, ' ')}</td>
                              <td scope="row" class="text-center">${Cantidad}</td>
                              <td>$${PrecioProducto}</td>
                              <td>$${subtotal}</td>
                          </tr>`;
        });

        html = `
                <div class="modal fade" id="pdfContent" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="pdfContentLabel" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header bg-orange text-white">
                                <h1 class="modal-title fs-5" id="pdfContentLabel">Recibo de Productos</h1>
                                <button type="button" class="btn" data-bs-dismiss="modal" aria-label="Close"><i class="fa-solid fa-x text-white"></i></button>
                            </div>
                            <div class="modal-body">
                                <div class="container">
                                    <div class="row">
                                        <div class="col-6">
                                            <h6 class="bg-darkblue-1 p-2 text-white"><span class="fw-bold">Fecha:      </span>${Details[0].Fecha}</h6>
                                            <h6 class="bg-darkblue-1 p-2 text-white text-center"><span class="fw-bold">No. Ticket: </span>${Details[0].IdCompra}</h6>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-12">
                                            <table class="table table-borderless mt-4">
                                                <thead class="bg-orange text-white">
                                                    <tr>
                                                        <th scope="col">Producto</th>
                                                        <th scope="col">Cant.</th>
                                                        <th scope="col">Precio c/u</th>
                                                        <th scope="col">Total</th>
                                                    </tr>
                                                </thead>
                                                <tbody>${productos}</tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-6 offset-6 d-flex justify-content-end">
                                            <h5 class=" bg-darkblue-1 p-2 text-white total">Total: $${total}</h5>
                                        </div>
                                        <div class="col-6 offset-6 d-flex justify-content-end">
                                            <h6 class=" bg-darkblue-1 p-2 text-white total">Cambio: $${Details[0].Cambio}</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" onclick="Cobro.loadProducts()" class="btn bg-darkblue-2 text-white " id="generatePDFButton"><i class="bi bi-printer-fill"></i> Imprimir</button>
                            </div>
                        </div>
                    </div>
                </div>`;

        content.innerHTML = html;
        const modal = new bootstrap.Modal(document.getElementById("pdfContent"));

        content.addEventListener("hidden.bs.modal", function () {
            content.innerHTML = "";
        });

        modal.show();
    },

    loadProducts : function(){
        const total = this.tempTicket.reduce(function(acc, element) { return acc + (element.PrecioProducto * element.Cantidad) - element.Descuento;}, 0);

        var nuevoArray = this.tempTicket.map(function(element) {
            return [element.Nombre, element.Cantidad, '$' + element.PrecioProducto, '$' + ((element.Cantidad * parseFloat(element.PrecioProducto)) - element.Descuento).toFixed(2)];
        });

        console.log(this.tempTicket)

        var docDefinition = {
            content: [{
                table: {
                    widths: ['*', 'auto', 'auto', 'auto'],
                    body: [
                        [{ text: 'No. Ticket:', bold: true, fillColor: '#F2F2F2' }, { text: this.tempTicket[0].IdCompra, fontSize: 12, fillColor: '#FFFFFF' }, { text: 'Fecha:', bold: true, fillColor: '#F2F2F2' }, { text: this.tempTicket[0].Fecha, fontSize: 12, fillColor: '#FFFFFF' }],
                        [
                          { text: 'Articulos' , style: 'tableHeader', fillColor: '#F2F2F2' },
                          { text: 'Cantidad'  , style: 'tableHeader', fillColor: '#F2F2F2' },
                          { text: 'Precio c/u', style: 'tableHeader', fillColor: '#F2F2F2' },
                          { text: 'Total'     , style: 'tableHeader', fillColor: '#F2F2F2' }
                        ],
                        ...nuevoArray,
                        [{ text: 'Total:'       , colSpan: 3, alignment: 'right' , bold: true, fontSize: 14, fillColor: '#F2F2F2' }, '', '', { text: total, bold: true, fontSize: 14, fillColor: '#FFFFFF' }],
                        [{ text: 'Cambio:'      , colSpan: 3, alignment: 'right' , bold: true, fontSize: 14, fillColor: '#F2F2F2' }, '', '', { text: this.tempTicket[0].Cambio, bold: true, fontSize: 14, fillColor: '#FFFFFF' }]
                    ]
                }
            }],
            styles: {
                tableHeader: {
                    bold     : true,
                    fontSize : 12,
                    color    : 'black'
               }
            }
        };
          
        pdfMake.createPdf(docDefinition).print();
    },


}

Cobro.getProductsAll();