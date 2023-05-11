const views = {
    getRoutes : function(){
        fetch('../../routes/path.json') 
            .then(response => response.json()) 
            .then(data => {
                const routes = data.routes;
                const paths = routes.map(route => route.path);
            })
            .catch(error => { console.error(error);});
    },
    
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