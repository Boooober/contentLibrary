App.Router = Backbone.Router.extend({
    routes: {
        '': 'index',
        '!/': 'index',
        '!/account/signin': 'accountSignin',
        '!/account/login': 'accountLogin',
        '!/account/logout': 'accountLogout',
        '!/account/recover': 'accountRecover',
        '!/account/destroy': 'accountDestroy',
        '!/account/edit': 'accountEdit',
        '!/contacts': 'contacts',
        '!/page/:id': 'page',
        '!/search/:s': 'search',
        '!/uploads': 'uploads',
        '!/favorites': 'favorites',
        '!/add-card': 'addCard'
    },

    execute: function (callback, args/*, name*/) {

        if (this.view) this.view.remove();

        // Call new route to render view
        if (callback) callback.apply(this, args);
    },

    index: function(){
        App.Vent.trigger('layoutChange');
        this.view = App.createLayout('view/Cards');

        App.Helpers.loadFromCollection({
            collection: App.create('collection/Cards')
        });
    },


    // Forms
    // ==============
    accountLogin: function(){
        App.Vent.trigger('layoutChange', {sidebarCollapsed: true});
        this.view = App.createForm('view/Login', {model: App.createForm('model/Login')});

        App.Helpers.renderContent(this.view.render().el);
    },

    accountLogout: function(){
        App.Vent.trigger('userLogout');
        this.navigate('', {trigger: true, replace: true});
    },

    accountSignin: function(){
        App.Vent.trigger('layoutChange', {sidebarCollapsed: true});
        this.view = App.createForm('view/Sigin', {model: App.createForm('model/Sigin')});

        App.Helpers.renderContent(this.view.render().el);
    },

    accountRecover: function(){
        App.Vent.trigger('layoutChange', {sidebarCollapsed: true});
        this.view = App.createForm('view/Recover', {model: App.createForm('model/Recover')});

        App.Helpers.renderContent(this.view.render().el);
    },

    accountEdit: function(){
        App.Vent.trigger('layoutChange');
        this.view = App.createForm('view/AccountEdit');

        App.Helpers.renderContent(this.view.render().el);
    },

    addCard: function(){
        App.Vent.trigger('layoutChange');
        this.view = App.createForm('view/AddCard');

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
        this.view = App.createLayout('view/Cards');

        App.Helpers.loadFromCollection({
            collection: App.create('collection/Cards'),

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
        this.view = App.createLayout('view/CardPage');

        App.Helpers.loadFromCollection({
            collection: App.create('collection/Cards'),
            find: {id: parseInt(id)}
        });
    },

    // Filters
    // ==============
    uploads: function(){
        App.Vent.trigger('layoutChange');
        this.view = App.createLayout('view/Cards');

        App.Helpers.loadFromCollection({
            collection: App.create('collection/Cards'),

            // Filtering function
            // Return every model, that content match to pattern
            filter: (function(){
                var user = new RegExp(App.getUser().get('fullname'), 'i');
                return function(model){
                    return user.test(model.get('author'));
                }
            })()
        });
    },

    favorites: function(){
        App.Vent.trigger('layoutChange');
        this.view = App.createLayout('view/Cards');

        App.Helpers.loadFromCollection({
            collection: App.create('collection/Cards'),

            // Filtering function
            // Return every model, that content match to pattern
            filter: function(model){
                return model.get('isFavorite');
            }
        });
    }
});