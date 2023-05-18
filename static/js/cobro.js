const Cobro = {
    productos  : [],
    IntervalID : null,

    elementos : {
        video : document.getElementById('video-stream'),
    },

    getProductsAll : function(){
        fetch('/productos/all').then(response => response.json())
            .then(data => {
                this.productos = data;
        }).catch(error => { console.error(error);});
    },

    detect : function(){
        fetch('/detect',{
            method : "POST",
            body   : ""
        }).then(response => response.json())
            .then(data => {
                if(data == true){
                    console.log("Detección iniciada")
                    this.IntervalID = setInterval(this.getDetections, 3000);
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
                    console.log("Detección detenida");
                    
                    clearInterval(this.IntervalID);
                    this.IntervalID = null;
                }
            }).catch(error => {console.error(error);})
    },

    getDetections : function(){
        fetch('/get_detections')
            .then(response => response.json())
            .then(data => {
                console.log(data);
             }).catch(error => {console.error(error);});
    },

    restartDetections : function() {
        fetch('/restart_detections')
            .then(response => response.json())
            .then(data => {
                console.log("Detecciones reiniciadas");
            })
        .catch(error => {console.error(error);});
    }
    
}

Cobro.getProductsAll();