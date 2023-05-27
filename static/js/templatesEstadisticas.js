const Templates = {
    elementos : {
        ganancias : document.getElementById('ganancias'),
        history  : document.getElementById('history')
    },

    porcentaje : 0,

    getDesglose : function(data, producto, fechas, mes=''){
        const dataDesglose = {
            ganancias : this.calGanancias(data),
            producto  : producto
        }

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

    loadDesglose : async function(data, fechas, mes){
        const numeroMenor = fechas.flat().find(numero => numero < mes);
        let   peningo = '';

        if (mes !== '' && numeroMenor !== undefined) {
            await this.calPorcentaje(data.ganancias, numeroMenor);
            peningo = this.porcentaje > 0 && this.porcentaje !== 0 ? `<i class="fa-solid fa-arrow-trend-up" style="color: #2f9309;"></i> ${this.porcentaje}%` : `<i class="fa-solid fa-arrow-trend-down" style="color: #a51d2d;"></i> ${this.porcentajeCambio}%`;
        }        

        

        let html = `
                <h4>Ganacias: </h4>
                <p>
                    <span class="fs-3 fw-bold">$${data.ganancias} MXN</span> 
                    ${peningo}
                </p>   
        `;

        this.elementos.ganancias.innerHTML = html;
        this.porcentaje = 0;
    },

    getHistory : function(data){

        this.processPurchasesByMonth(this.separatePurchasesByMonth(data))
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
                    const { date, total } = purchase;
                    
                    const purchaseElement = document.createElement('div');
                    purchaseElement.className = 'row border-bottom hover-accordion p-2';
                    accordionBody.appendChild(purchaseElement);
                    
                    const dateElement = document.createElement('div');
                    dateElement.className = 'col-6';
                    dateElement.innerHTML = `<p>Fecha: ${this.formatDate(date)}</p>`;
                    purchaseElement.appendChild(dateElement);
                    
                    const totalElement = document.createElement('div');
                    totalElement.className = 'col-3 text-right';
                    totalElement.innerHTML = `<p>Total: $${total}</p>`;
                    purchaseElement.appendChild(totalElement);
                    
                    const buttonElement = document.createElement('div');
                    buttonElement.className = 'col-3 d-flex justify-content-end mb-2';
                    buttonElement.innerHTML = `<button type="button" class="btn btn-primary" onclick="estadisticas.vermas()">Ver más</button>`;
                    purchaseElement.appendChild(buttonElement);
                });
            
                this.elementos.history.appendChild(accordionItem);
          }
        }
    },

    loadProducts : function(productos) {
        const contenedor = document.getElementById('body-products');
        contenedor.innerHTML = '';
      
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

    formatDate : function(dateString) {
        const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', options);
    }
}