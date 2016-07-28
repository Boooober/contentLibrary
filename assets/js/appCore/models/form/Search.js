App.set('model/Search', 'form', Backbone.Model.extend({
    defaults: {
        s: App.Helpers.getQueryParam('s')
    },
    search: function(s){
        var collection = App.create('collection/Carts');
        this.set('s', s);

        collection.fetch({
            success: function(){
                var pattern;

                if(s){
                    pattern = new RegExp(s, 'i');
                    collection.reset(collection.filter(function(model){
                        return pattern.test(model.get('title')) || pattern.test(model.get('description'));
                    }));
                }

                App.Vent.trigger('collectionLoad', collection);
            }
        });
    }
}));