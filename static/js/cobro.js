const Cobro = {
    productos  : [],
    IntervalID : null,

    elementos : {
        video        : document.getElementById('video-stream'),
        product_list : document.getElementById('product-list'),
        detectar     : document.getElementById('detectar'),
        detener      : document.getElementById('detener')
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
        this.elementos.product_list.innerHTML = '';
        let html = ``;

        for (let i = 0; i < this.productos.length; i++) {      
            for (let j = 0; j < data.length; j++) {
                if (this.productos[i].Name == data[j].names) {
                    html += `
                            <div class="product mt-2" id="${this.productos[i].Name}-container">
                                <div class="name">${this.productos[i].Name}</div>
                                <div class="price">${this.productos[i].Price}</div>
                                <div class="quantity">
                                    <button onclick="Cobro.decrementProducts(${this.productos[i].Name})">-</button>
                                    <input type="text" id="${this.productos[i].Name}" name="${this.productos[i].Name}" value="1">
                                    <button onclick="Cobro.addProducts(${this.productos[i].Name})">+</button>
                                </div>
                            </div>
                    `;
                }
                
            }
        }

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
        for (let i = 0; i < data.length; i++) {
            const elemento = data[i];
        
            const producto = {
                ID          : elemento[0],
                Name        : elemento[1],
                Description : elemento[2],
                Price       : elemento[3],
                IDsuppliers : elemento[4],
                Stock       : elemento[5],
                NameCompany : elemento[6],
            };

            this.productos.push(producto);
        }
    }, 

    addProducts : function(element){
        if (element.value < 11) {
            element.value = parseInt(element.value) + 1;
        }
    },

    decrementProducts : function(element){
        if (element.value > 1) {
            element.value = element.value - 1;
        }
    }
}

Cobro.getProductsAll();