const Cobro = {
    productos   : [],
    valuesTemp  : [],
    detecciones : [],
    IntervalID  : null,

    elementos : {
        video        : document.getElementById('video-stream'),
        product_list : document.getElementById('product-list'),
        detectar     : document.getElementById('detectar'),
        detener      : document.getElementById('detener'),
        form         : document.getElementById('form-cobro')
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
        this.detecciones = data;
        this.elementos.product_list.innerHTML = '';
        let html  = ``;
        let total = 0;

        const keys = new Set(data.map(key => key.names));

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


        html += `<hr class="mb-2">
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
                 `

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
            .then(data => {
                console.log("Detecciones reiniciadas");
            })
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
            this.valuesTemp.push({
                [ID]: {
                  value: parseInt(cant)
                }
            });
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
        if (index !== -1) {
            this.valuesTemp.splice(index, 1);
        }

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

    existProducts : function(){
        const textInputs = document.querySelectorAll('input[type="text"]');
        if (textInputs.length === 0) { this.resetCompra(); }
    },

    resetCompra : function(){
        this.valuesTemp  = [];
        this.detecciones = [];
        this.elementos.product_list.innerHTML = '';
        //this.restartDetections();
    },

    payProduct : function(){
        const data = new FormData(this.elementos.form)

        fetch('/pagarproductos', {
            method : 'POST',
            body   : data
        }).then(response => response.json())
            .then(data => {
                console.log(data);
            }).catch(error => { console.error(error);});
    }
}

Cobro.getProductsAll();