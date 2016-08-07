App.State = new (Backbone.Model.extend({
    storage: App.Helpers.storage,
    defaults: {
        user: {},
        router: {},
        layout: {},
        query: {}
    },

    initialize: function(){
        this.listenTo(App.Vent, 'loginSuccess', this.userLogin);
        this.listenTo(App.Vent, 'userLogout', this.userLogout);
    },

    userLogin: function(user){
        this.set('user', user);
        this.storage.set('userId', user.id);

        // Go to index page after success login
        App.getRouter().navigate('', {trigger: true});
    },

    userLogout: function(){
        this.set('user', false);
        this.storage.remove('userId');
    },

    run: function(){
        // Fetch user
        var self = this,
            id = this.storage.get('userId');

        if(id){
            // User was logged in, restore session
            App.create('collection/Users').fetch({
                success: function success(collection){
                    var user = collection.get(id);
                    if(user) self.set('user', user);

                    //Draw application layouts
                    self.draw();
                },
                error: function (collection, response){
                    console.log(response.responseText);
                }
            });
            return;
        }

        this.set('user', false);

        //Draw application layouts
        self.draw();
    },

    draw: function(){
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