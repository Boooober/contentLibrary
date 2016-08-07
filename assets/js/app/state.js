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
        var router = new App.Router;

        // http://mikeygee.com/blog/backbone.html
        // Run views purge before every routers url change
        $(window).on('hashchange', router.beforeRouteChange.bind(router));
        Backbone.history.start();


    }
}));
App.State.run();