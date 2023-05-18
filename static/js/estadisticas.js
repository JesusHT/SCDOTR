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
            const dataProductos = await responseProductos.json();

            this.datosGrafica.labels = dataProductos.map(d => d[0]);
            this.datosGrafica.values = dataProductos.map(d => d[1]);

            this.getGraficar();
            
            const responseFechas = await fetch('/estadisticas/fechas');
            this.fechasCompras = await responseFechas.json();

            this.getOpciones();
                    
        } catch(error){ console.error(error); }
    },

    getGraficar : function(){   

        var canvas = this.elementos.grafica;

        if (canvas.myChart) {
            canvas.myChart.destroy();
        }

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

    getProductosByPeriodo : function(){
        
        let mes = this.elementos.opciones.value;

        fetch(`/estadisticas/productosmasvendidos/${mes}`)
            .then(response => response.json())
            .then(data => {
                this.datosGrafica.labels = data.map(d => d[0]);
                this.datosGrafica.values = data.map(d => d[1]);
                
                this.getGraficar();

            }).catch(error => {console.error(error)})
    }

}

Estadisticas.getEstadisticas();