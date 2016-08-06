App.State = new (Backbone.Model.extend({
    defaults: {
        user: {},
        layout: {},
        query: {}
    },

    initialize: function(){
        //fetch user
    },

    run: function(){
        // Create initial layout model and set as property to app state
        this.set('layout', App.create('model/Main', 'layout'));
        
        // Create main layout view
        App.create('view/Wrapper', 'layout');
        App.Vent.trigger('layoutRender');

        // Run routers when application starts
        new App.Router;
        Backbone.history.start();


    }
}));
App.State.run();