App.Router = Backbone.Router.extend({
    routes: {
        '': 'index',
        '!/': 'index',
        '!/account/signin': 'signin',
        '!/account/login': 'login',
        '!/account/logout': 'logout',
        '!/account/recover': 'recover',
        '!/contacts': 'contacts',
        '!/page/:id': 'page',
        '!/search/:s': 'search'
        //'!/account': 'account'
        //'!/category-:id': 'category',
        //'!/add-media': 'addMedia'
    },

    execute: function (callback, args/*, name*/) {

        if (this.view) this.view.remove();

        // Call new route to render view
        if (callback) callback.apply(this, args);
    },

    index: function(){
        App.Vent.trigger('layoutChange');
        this.view = App.createLayout('view/Carts');

        App.Helpers.loadFromCollection({
            collection: App.create('collection/Carts')
        });
    },


    // Forms
    // ==============
    login: function(){
        App.Vent.trigger('layoutChange', {sidebarCollapsed: true});
        this.view = App.createForm('view/Login', {model: App.createForm('model/Login')});

        App.Helpers.renderContent(this.view.render().el);
    },

    logout: function(){
        App.Vent.trigger('userLogout');
        this.navigate('', {trigger: true, replace: true});
    },

    signin: function(){
        App.Vent.trigger('layoutChange', {sidebarCollapsed: true});
        this.view = App.createForm('view/Sigin', {model: App.createForm('model/Sigin')});

        App.Helpers.renderContent(this.view.render().el);
    },

    recover: function(){
        App.Vent.trigger('layoutChange', {sidebarCollapsed: true});
        this.view = App.createForm('view/Recover', {model: App.createForm('model/Recover')});

        App.Helpers.renderContent(this.view.render().el);
    },
    // ==============


    //Pages
    // ==============
    contacts: function(){
        App.Vent.trigger('layoutChange', {sidebarCollapsed: true});
        this.view = App.createLayout('view/Contacts').render();
    },

    search: function(s){
        App.Vent.trigger('layoutChange');
        this.view = App.createLayout('view/Carts');

        App.Helpers.loadFromCollection({
            collection: App.create('collection/Carts'),

            // Filtering function
            // Return every model, that content match to pattern
            filter: (function(){
                var pattern = new RegExp(s, 'i');
                return function(model){
                    return pattern.test(model.get('title')) || pattern.test(model.get('description'));
                }
            })()
        });
    },

    page: function(id){
        App.Vent.trigger('layoutChange');
        this.view = App.createLayout('view/CartPage');

        App.Helpers.loadFromCollection({
            collection: App.create('collection/Carts'),
            find: {id: parseInt(id)}
        });
    },

    addMedia: function(){

    }
    // ==============
});