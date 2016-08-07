App.State = new (Backbone.Model.extend({
    storage: App.Helpers.storage('State'),
    defaults: {
        user: {},
        router: {},
        layout: {},
        query: {}
    },

    initialize: function(){
        // Fetch user
        var id = this.storage.get().userId;

        if(id){
            // User was logged in, restore session
            App.create('collection/Users').fetch({
                success: function success(collection){
                    var user = collection.get(id);
                    console.log(user);
                },
                error: function (collection, response){
                    console.log(response.responseText);
                }
            });
        }

        this.set('user', false);
    },

    run: function(){
        // Create initial layout model and set as property to app state
        this.set('layout', App.create('model/Main', 'layout'));
        
        // Create main layout view
        App.create('view/Wrapper', 'layout');
        App.Vent.trigger('layoutRender');

        // Run routers when application starts
        this.set('router', new App.Router);
        Backbone.history.start();

    }
}));
App.State.run();