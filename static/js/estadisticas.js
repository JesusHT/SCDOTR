const Estadisticas = {
    elementos : {
        grafica     : document.getElementById('myChart'),
        opciones    : document.getElementById('mes')

    },

    datosGrafica : {
        labels : [],
        values : []
    },

    fechasCompras : [], 

    getEstadisticas : async function () {
        try {
            const responseProductos = await fetch('/estadisticas/productosmasvendidos');
            const dataProductos     = await responseProductos.json();

            const [nombreProductoMayorCantidad] = dataProductos.reduce((mayorProducto, producto) =>
                parseInt(producto[1]) > parseInt(mayorProducto[1]) ? producto : mayorProducto
            ); 

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

            Templates.getDesglose(dataestadisticas, nombreProductoMayorCantidad, this.fechasCompras);
            Templates.getHistory(dataestadisticas);
                    
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

    getProductosByPeriodo :  async function(){
        
        let mes = this.elementos.opciones.value;

        try {
            const products      = await fetch(`/estadisticas/productosmasvendidos/${mes}`);
            const dataProducts  = await products.json();

            const [nombreProductoMayorCantidad] = dataProducts.reduce((mayorProducto, producto) =>
                parseInt(producto[1]) > parseInt(mayorProducto[1]) ? producto : mayorProducto
            ); 
            
            this.datosGrafica.labels = dataProducts.map(d => d[0]);
            this.datosGrafica.values = dataProducts.map(d => d[1]);
            
            this.getGraficar();

            const sales     = await fetch(`/estadisticas/ventaspormes/${mes}`);
            const dataSales = await sales.json();

            Templates.getDesglose(dataSales, nombreProductoMayorCantidad, this.fechasCompras, mes);
            Templates.getHistory(dataSales);

            const responseProductosVendidos = await fetch(`/estadisticas/productosvendidos/${mes}`);
            const dataProductosVendidos     = await responseProductosVendidos.json();

            Templates.loadProducts(this.createArrayProducts(dataProductosVendidos));
            
        } catch(error){ console.error(error); }
    }, 

    loadProducts : function(){
        var docDefinition = {
            content: [
                { text: 'Mi primer documento PDF', style: 'header' },
                { text: 'Este es un párrafo de ejemplo en el PDF.' }
            ],
            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                    margin: [0, 0, 0, 10]
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
                nombre: nombreProducto,
                cantidad: productos[nombreProducto].cantidad,
                ganancias: productos[nombreProducto].ganancias,
                top: productos[nombreProducto].top,
                id: productos[nombreProducto].id
            });
        }
          
        return nuevoArray;
    }
}

Estadisticas.getEstadisticas();

