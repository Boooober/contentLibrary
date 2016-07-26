App.Collections.Carts = Backbone.Collection.extend({
    //initialize: function(){
    //    this.listenTo(App.Vent, 'collectionLoad', this.search);
    //},
    url: 'assets/js/database/carts.json',
    model:App.Models.Cart,

    search: function(query){
        if(!query) return this;
        var result = this.filter(function(model){
            return model.get('title').search(query) !== -1 ||
                model.get('content').search(query) !== -1
        });
        return new App.Collections.Carts(result);
    }

});
