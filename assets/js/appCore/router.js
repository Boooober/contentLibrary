App.Router = Backbone.Router.extend({
    routes: {
        '': 'index',
        '!/': 'index',
        '!/login': 'login',
        '!/sigin': 'sigin',
        '!/page-:id': 'page',
        '!/category-:id': 'category',
        '!/add-media': 'addMedia'
    },

    index: function(){
        console.log('index');
        var collection = new App.Collections.Carts,
            carts = new App.Views.Carts;
        collection.fetch({
            success: success,
            error: error
        });

        function success(){
            App.Vent.trigger('collectionLoad', collection);
            App.Helpers.renderContent(carts.render().el);
        }
        function error(collection, response){
            console.log(response.responseText);
            //MyApp.vent.trigger("search:error", response);
        }
    },

    login: function(){
        App.Vent.trigger('layoutRedraw', {sidebar: false});
        console.log('login');
    }


});
new App.Router;
Backbone.history.start();
