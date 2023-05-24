const Templates = {
    elementos : {
        desglose : document.getElementById('desglose'),
        history  : document.getElementById('history')
    },

    getDesglose : function(data, producto){
        const dataDesglose = {
            more      : '',
            ganancias : this.calGanancias(data),
            producto  : producto
        }

        this.loadDesglose(dataDesglose);
    },

    calGanancias : function(registros){
        const total = registros.reduce((sum, registro) => sum + parseFloat(registro[2]), 0);

        return total.toFixed(2);
    },

    calPorcentaje : function(data){

    },

    loadDesglose : function(data){

        let html = `
            <h3 class="text-center">Desglose</h3>

            <div class="p-2">
                <p class="fs-4">Ganacias: </p>
                <p>
                    <span class="fs-3 fw-bold">$${data.ganancias} MXN</span> 
                    ${data.more}
                </p>
            </div>
            <div class="p-2">
                <p class="fs-4">Producto más vendido:</p>
                <div class="text-center">
                    <img src="./../static/img/${data.producto}.png" alt="${data.producto}" class="img-fluid rounded bg-dark rounded-circle p-3" width="200" title="${data.producto}"> 
                </div>
            </div>   
        `;

        this.elementos.desglose.innerHTML = html;
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
            
            if (!purchasesByMonth.hasOwnProperty(month)) {
                purchasesByMonth[month] = [];
            }
          
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

    formatDate : function(dateString) {
        const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', options);
    }
}