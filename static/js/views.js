const views = {
    load : function(path){
        window.location.href = path;
    },

    loadRole : function(role){
        if (role == "admin") {
            this.load("estadisticas")      
        } else {
            this.load("cobro")
        }
    }
}