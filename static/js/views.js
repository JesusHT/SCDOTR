const views = {
    load : function(path){
        window.location.href = path;
    },

    loadRole : function(role){
        if (role == "admin") {
            this.load("productos")      
        } else {
            this.load("cobro")
        }
    }
}