App.Models.SearchForm = Backbone.Model.extend({
    defaults: {
        s: App.Helpers.getQueryParam('s')
    },
    search: function(s){
        var collection = new App.Collections.Carts;
        this.set('s', s);

        collection.fetch({
            success: function(){

                if(s){
                    collection.reset(collection.filter(function(model){
                        return model.get('title').search(s) !== -1 ||
                        model.get('content').search(s) !== -1
                    }));
                }

                App.Vent.trigger('collectionLoad', collection);
            }
        });
    }
});