const Estadisticas = {
    elementos : {
        grafica     : document.getElementById('myChart'),
        opciones    : document.getElementById('mes'),
        search      : document.getElementById('search') 
    },

    datosGrafica : {
        labels : [],
        values : []
    },

    tempTicket    : [],

    fechasCompras : [], 

    getEstadisticas : async function () {
        
        try {
            const responseProductos = await fetch('/estadisticas/productosmasvendidos');
            const dataProductos     = await responseProductos.json();

            this.datosGrafica.labels = dataProductos.map(d => d[0]);
            this.datosGrafica.values = dataProductos.map(d => d[1]);

            this.getGraficar();

            const responseProductosVendidos = await fetch('/estadisticas/productosvendidos/0');
            const dataProductosVendidos     = await responseProductosVendidos.json();

            Templates.loadProducts(this.createArrayProducts(dataProductosVendidos));
            
            const responseFechas = await fetch('/estadisticas/fechas');
            this.fechasCompras   = await responseFechas.json();

            this.getOpciones();

            const estadisticas     = await fetch('/estadisticas/periodos');
            const dataestadisticas = await estadisticas.json();

            Templates.getDesglose(dataestadisticas, this.fechasCompras);
            Templates.getHistory(dataestadisticas);

            const verifyingStock = await fetch('/stock');
            const stock          = await verifyingStock.json();

            if (stock != 'False') {
                Templates.loadMessage(stock);  
            }
                    
        } catch(error){ console.error(error); }
    },

    getGraficar : function(){   

        var canvas = this.elementos.grafica;

        if (canvas.myChart){canvas.myChart.destroy();}

        var myChart = new Chart(canvas, {
            type: 'pie',
            data: {
                labels: this.datosGrafica.labels,
                datasets: [{
                    label: 'Productos más vendidos',
                    data: this.datosGrafica.values,
                    backgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#4BC0C0',
                        '#9966FF'
                    ]
                }]
            },
            options: {
                responsive: true
            }
        });

        canvas.myChart = myChart;

    },

    getOpciones : function(){
        let html = '<option value="0">General</option>';

        this.fechasCompras.forEach(fecha => {
            html +=  `<option value="${fecha}">Periodo 0${fecha}/2023</option>`
        });

        this.elementos.opciones.innerHTML = html;
    },

    getProductosByPeriodo : async function(){
        try {
            let mes = this.elementos.opciones.value;

            const products      = await fetch(`/estadisticas/productosmasvendidos/${mes}`);
            const dataProducts  = await products.json();
            
            this.datosGrafica.labels = dataProducts.map(d => d[0]);
            this.datosGrafica.values = dataProducts.map(d => d[1]);
            
            this.getGraficar();

            const sales     = await fetch(`/estadisticas/ventaspormes/${mes}`);
            const dataSales = await sales.json();

            Templates.getDesglose(dataSales, this.fechasCompras, mes);
            Templates.getHistory(dataSales);

            const responseProductosVendidos = await fetch(`/estadisticas/productosvendidos/${mes}`);
            const dataProductosVendidos     = await responseProductosVendidos.json();

            Templates.loadProducts(this.createArrayProducts(dataProductosVendidos));
            
        } catch(error){ console.error(error); }
    },
    
    seeMore : function(idCompra){
        fetch(`/estadisticas/detallesdecompra/${idCompra}`)
            .then(response => response.json())
            .then(details => {
                this.tempTicket = details;
                Templates.loadTicket(details);
            }).catch(error => { console.error(error); })
    },

    loadProducts : function(){
        const total = this.tempTicket.reduce(function(acc, element) { return acc + (element.PrecioProducto * element.Cantidad) - element.Descuento;}, 0);

        var nuevoArray = this.tempTicket.map(function(element) {
            return [element.Nombre, element.Cantidad, '$' + element.PrecioProducto, '$' + ((element.Cantidad * parseFloat(element.PrecioProducto)) - element.Descuento).toFixed(2)];
        });

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
                        [{ text: 'Total:'       , colSpan: 3, alignment: 'right' , bold: true, fontSize: 14, fillColor: '#F2F2F2' }, '', '', { text: total, bold: true, fontSize: 14, fillColor: '#FFFFFF' }]
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

    createArrayProducts : function(arr){
        const productos = {};

        arr.forEach(item => {
            const nombreProducto = item.Nombre;
            const cantidad       = parseFloat(item.Cantidad);
            const precioProducto = parseFloat(item.PrecioProducto);
            const descuento      = parseFloat(item.Descuento);
            const idProducto     = item.IdProducto;
        
            if (!productos.hasOwnProperty(nombreProducto)) {
                productos[nombreProducto] = {
                    cantidad: 0,
                    ganancias: 0,
                    top: false,
                    id: idProducto
                };
            }
        
            productos[nombreProducto].cantidad  += cantidad;
            productos[nombreProducto].ganancias += (cantidad * precioProducto) - descuento;
        });
      
        let productoMasVendido = null;
        let maxCantidad = 0;
      
        for (const nombreProducto in productos) {
            const cantidad = productos[nombreProducto].cantidad;
        
            if (cantidad > maxCantidad) {
                maxCantidad = cantidad;
                productoMasVendido = nombreProducto;
            }
        }
      
        if (productoMasVendido !== null) {
            productos[productoMasVendido].top = true;
        }
      
        const nuevoArray = [];
      
        for (const nombreProducto in productos) {
            nuevoArray.push({
                nombre     : nombreProducto,
                cantidad   : productos[nombreProducto].cantidad,
                ganancias  : productos[nombreProducto].ganancias,
                top        : productos[nombreProducto].top,
                id         : productos[nombreProducto].id
            });
        }
          
        return nuevoArray;
    }
}

Estadisticas.getEstadisticas();

Estadisticas.elementos.search.addEventListener("input", async () => {
    let search = Estadisticas.elementos.search.value;
    let mes    = Estadisticas.elementos.opciones.value;

    if (search !== ''){
        const data = new FormData();
        data.append('search', search);
        data.append('mes', mes);
        
        const sales     = await fetch('/estadisticas/buscar', {
            method : 'POST',
            body   : data
        });
        const dataSales = await sales.json();
        
        Templates.getHistoryBySearch(dataSales);
        
    } else {
        const sales     = await fetch(`/estadisticas/ventaspormes/${mes}`);
        const dataSales = await sales.json();

        Templates.getHistory(dataSales);
    }
});