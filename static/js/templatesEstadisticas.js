const Templates = {
    elementos : {
        ganancias : document.getElementById('ganancias'),
        history   : document.getElementById('history'),
        messages  : document.getElementById('messages-list'),
        search    : document.getElementById('search'),
        previous  : document.getElementById('Previous'),
        next      : document.getElementById('Next')
    },

    porcentaje : 0,

    getDesglose : function(data, fechas, mes=''){
        const dataDesglose = this.calGanancias(data);
        this.loadDesglose(dataDesglose, fechas, mes);
    },

    calGanancias : function(registros){
        const total = registros.reduce((sum, registro) => sum + parseFloat(registro[2]), 0);
        return total.toFixed(2);
    },

    calPorcentaje : async function(ganancias, mes){
        const ingresosMesActual = ganancias;
        
        const neto     = await fetch(`/gananciaspormes/${mes}`);
        const cantidad = await neto.json();

        const ingresosMesAnterior = cantidad[0].ganancias;

        const diferenciaIngresos = ingresosMesActual - ingresosMesAnterior;
        const porcentajeCambio = (diferenciaIngresos / ingresosMesAnterior) * 100;
        const porcentajeCambioRedondeado = porcentajeCambio.toFixed(2);

        this.porcentaje = porcentajeCambioRedondeado;
    },

    loadDesglose : async function(ganancia, fechas, mes){
        const numeroMenor = fechas.flat().find(numero => numero < mes);
        
        let   peningo = '';

        if (mes !== '' && numeroMenor !== undefined) {
            await this.calPorcentaje(ganancia, numeroMenor);
            peningo = this.porcentaje > 0 && this.porcentaje !== 0 ? `<i class="fa-solid fa-arrow-trend-up" style="color: #2f9309;"></i> ${this.porcentaje}%` : `<i class="fa-solid fa-arrow-trend-down" style="color: #a51d2d;"></i> ${this.porcentajeCambio}%`;
        }        

        let html = `
                <h4>Ganacias: </h4>
                <p>
                    <span class="fs-3 fw-bold">$${ganancia} MXN</span> 
                    ${peningo}
                </p>   
        `;

        this.elementos.ganancias.innerHTML = html;
        this.porcentaje = 0;
    },

    getHistory : function(data){
        this.processPurchasesByMonth(this.separatePurchasesByMonth(data))
    },
    
    getHistoryBySearch : function(data){
        if (data.length !== 0) {
            this.processPurchasesBySerch(this.separatePurchasesByMonth(data))
        } else {
            this.elementos.history.innerHTML = '<div class="alert alert-info" role="alert">No hay coincidencias con sus criterios de busqueda.</div>' 
        }
    },

    separatePurchasesByMonth : function(purchasesArray) {
        const purchasesByMonth = {};
      
        for (let i = 0; i < purchasesArray.length; i++) {
            const purchase = purchasesArray[i];
            const [, dateString, amount] = purchase;
            
            const date = new Date(dateString);
            const month = date.toLocaleString('es', { month: 'long' });
            
            if (!purchasesByMonth.hasOwnProperty(month)) { purchasesByMonth[month] = []; }
          
            purchasesByMonth[month].push({
                id: purchase[0],
                date: date,
                total: parseFloat(amount)
            });
        }
      
        return purchasesByMonth;
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
                            <div class="modal-header">
                                <h1 class="modal-title fs-5" id="pdfContentLabel">Recibo de Productos</h1>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <div class="container">
                                    <div class="row">
                                        <div class="col-6">
                                            <h6> <span class="fw-bold">Fecha:      </span>${Details[0].Fecha}</h6>
                                            <h6> <span class="fw-bold">No. Ticket: </span>${Details[0].IdCompra}</h6>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-12">
                                            <table class="table table-borderless mt-4">
                                                <thead>
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
                                        <div class="col-6 offset-6">
                                            <h5 class="text-end">Total: $${total}</h5>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" onclick="Estadisticas.loadProducts()" class="btn btn-primary" id="generatePDFButton"><i class="bi bi-printer-fill"></i> Imprimir</button>
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

    processPurchasesBySerch : function(data){
        const tabla = document.createElement('table');
        tabla.classList.add('table', 'table-striped-columns', 'table-hover', 'mt-2');
            
        const encabezado = document.createElement('thead');
        encabezado.innerHTML = `
          <tr>
            <th scope="col">No.</th>
            <th scope="col">Fecha</th>
            <th scope="col">Total</th>
            <th scope="col" class="text-center">Acción</th>
          </tr>
        `;
        tabla.appendChild(encabezado);
            
        const cuerpo = document.createElement('tbody');
            
        for (const month in data) {
            const purchase = data[month];

            purchase.forEach(element => {
                const {id, date, total} = element;
    
                const fila = document.createElement('tr');
                
                fila.innerHTML = `
                  <td scope="row">${id}</td>
                  <td>${this.formatDate(date)}</td>
                  <td>$${total}</td>
                  <td class="d-flex justify-content-center"><button type="button" class="btn btn-primary" onclick="Estadisticas.seeMore(${id})">Ver más</button></td>
                `;
                 cuerpo.appendChild(fila);
            });
            
        }
        
        tabla.appendChild(cuerpo);

        this.elementos.history.innerHTML = '';
        this.elementos.history.appendChild(tabla);
    },

    processPurchasesByMonth : function(purchasesByMonth) {
        this.elementos.history.innerHTML = '';

        for (const month in purchasesByMonth) {
            if (purchasesByMonth.hasOwnProperty(month)) {
                const purchases = purchasesByMonth[month];

                const accordionItem = document.createElement('div');
                accordionItem.className = 'accordion-item';

                const accordionHeader = document.createElement('h2');
                accordionHeader.className = 'accordion-header';
                accordionItem.appendChild(accordionHeader);

                const accordionButton = document.createElement('button');
                accordionButton.className = 'accordion-button collapsed bg-gray-light';
                accordionButton.setAttribute('type', 'button');
                accordionButton.setAttribute('data-bs-toggle', 'collapse');
                accordionButton.setAttribute('data-bs-target', `#collapse-${month}`);
                accordionButton.setAttribute('aria-expanded', 'false');
                accordionButton.setAttribute('aria-controls', `collapse-${month}`);
                accordionButton.textContent = `Ventas del periodo ${month}`;
                accordionHeader.appendChild(accordionButton);

                const accordionCollapse = document.createElement('div');
                accordionCollapse.id = `collapse-${month}`;
                accordionCollapse.className = 'accordion-collapse collapse';
                accordionItem.appendChild(accordionCollapse);

                const accordionBody = document.createElement('div');
                accordionBody.className = 'accordion-body';
                accordionCollapse.appendChild(accordionBody);

                purchases.forEach(purchase => {
                    const { date, total, id } = purchase;
                    
                    const purchaseElement = document.createElement('div');
                    purchaseElement.className = 'row border-bottom hover-accordion p-2';
                    accordionBody.appendChild(purchaseElement);
                    
                    const dateElement = document.createElement('div');
                    dateElement.className = 'col-6';
                    dateElement.innerHTML = `<p>No. Ticket: ${id} <br>Fecha: ${this.formatDate(date)}</p>`;
                    purchaseElement.appendChild(dateElement);
                    
                    const totalElement = document.createElement('div');
                    totalElement.className = 'col-3 text-right';
                    totalElement.innerHTML = `<p>Total: $${total}</p>`;
                    purchaseElement.appendChild(totalElement);
                    
                    const buttonElement = document.createElement('div');
                    buttonElement.className = 'col-3 d-flex justify-content-end mb-2';
                    buttonElement.innerHTML = `<button type="button" class="btn btn-primary mb-3" style="height: 70%;" onclick="Estadisticas.seeMore(${id})">Ver más</button>`;
                    purchaseElement.appendChild(buttonElement);
                });
            
                this.elementos.history.appendChild(accordionItem);
            }

        }

        this.elementos.search.style.display = "block";
    },

    loadProducts : function(productos) {
        const contenedor = document.getElementById('body-products');
        contenedor.innerHTML = '';

        if (productos.length == 1) {
            this.elementos.previous.classList.add('opacity-0');
            this.elementos.next.classList.add('opacity-0'); 
        } else {
            this.elementos.previous.classList.remove('opacity-0');
            this.elementos.next.classList.remove('opacity-0'); 
        }
      
        productos.forEach(producto => {
            const { nombre, id, cantidad, ganancias, top } = producto;
            const activo = top ? 'active' : '';
            
            const carouselItem = document.createElement('div');
            carouselItem.classList.add('carousel-item');
            carouselItem.classList.toggle('active', !!activo);
            
            const row = document.createElement('div');
            row.classList.add('row');
            
            const imageCol = document.createElement('div');
            imageCol.classList.add('col-md-6');
            imageCol.classList.add('d-flex');
            imageCol.classList.add('justify-content-center');
            imageCol.classList.add('align-items-center');
            
            const productImage = document.createElement('div');
            productImage.classList.add('product-image');
            productImage.classList.add('rounded-circle');

            let style = top ? 'bg-top-product' : 'bg-product';

            productImage.classList.add(style);
            
            const image = document.createElement('img');
            image.src = `./../static/img/${nombre}.png`;
            image.classList.add('d-block');
            image.classList.add('w-100');
            image.alt = 'Product';
            
            const textCol = document.createElement('div');
            textCol.classList.add('col-md-6');
            textCol.classList.add('d-flex');
            textCol.classList.add('flex-column');
            textCol.classList.add('justify-content-center');
            textCol.classList.add('bg-dark');
            textCol.classList.add('text-white');
            textCol.classList.add('p-4');
            
            const productName = document.createElement('h4');
            productName.classList.add('text-center');
            
            productName.textContent = nombre == 'Chetos' ? 'Cheetos' : nombre.replace(/_/g, ' ');
            
            const productId = document.createElement('p');
            productId.classList.add('mb-2');
            productId.textContent = `No. Producto: ${id}`;
            
            const productQuantity = document.createElement('p');
            productQuantity.classList.add('mb-2');
            productQuantity.textContent = `Cantidad vendida: ${cantidad}`;
            
            const productGanancias = document.createElement('p');
            productGanancias.classList.add('mb-2');
            productGanancias.textContent = `Ganancias: $${ganancias}`;
            
            productImage.appendChild(image);
            imageCol.appendChild(productImage);
            
            textCol.appendChild(productName);
            textCol.appendChild(productId);
            textCol.appendChild(productQuantity);
            textCol.appendChild(productGanancias);
            
            row.appendChild(imageCol);
            row.appendChild(textCol);
            
            carouselItem.appendChild(row);
            
            contenedor.appendChild(carouselItem);
        });
    },

    loadMessage : function(products) {
        let html     = '';
        let elements = [];
        
        products.forEach(element => {
            const { Email, NombreContacto, NombreEmpresa, NombreProducto, Telefono, TotalProducto } = element;

            html += `
                    <div id="${NombreProducto}" class="toast align-items-center bg-danger text-white border-0" role="alert" aria-live="assertive" aria-atomic="true" autohide="false">
                      <div class="toast-header">
                        <strong class="me-auto">¡ATENCIÓN!</strong>
                        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                      </div>
                      <div class="toast-body">
                        Poco stock de ${NombreProducto == 'Chetos' ? 'Cheetos' : NombreProducto.replace(/_/g, ' ')}. Recomendamos contactar al proveedor ${NombreEmpresa}.
                        <br>Contacta a <b>${NombreContacto}</b>.
                        <br><i class="fa-solid fa-envelope text-black"></i> Email:  <b>${Email}</b>  
                        <br><i class="fa-solid fa-phone text-black"></i> Teléfono:  <b>${Telefono}</b>.
                      </div>
                    </div>`;

            elements.push(NombreProducto);                    
        });

        this.elementos.messages.innerHTML = html;

        elements.forEach(element => {
            const toasts = document.getElementById(element);
            const toast  = new bootstrap.Toast(toasts);
            toast._config.autohide = false;
            toast.show();
        });
    },

    formatDate : function(dateString) {
        const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', options);
    }
}