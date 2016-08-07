App.Router = Backbone.Router.extend({
    routes: {
        '': 'index',
        '!/': 'index',
        '!/account/signin': 'signin',
        '!/account/login': 'login',
        '!/account/logout': 'logout',
        '!/account/recover': 'recover',
        '!/contacts': 'contacts',
        //'!/account': 'account',
        //'!/page/:id': 'page'
        //'!/category-:id': 'category',
        //'!/add-media': 'addMedia'
    },

    execute: function (callback, args, name) {

        if (this.view) this.view.remove();


        // Call new route to render view
        if (callback) callback.apply(this, args);
    },

    index: function(){
        App.Vent.trigger('layoutChange');

        var collection = App.create('collection/Carts'),
            view = this.view = App.createLayout('view/Carts');


        collection.fetch({
            success: success,
            error: error
        });

        function success(collection){
            App.Vent.trigger('collectionLoad', collection);
            App.setQuery(collection);
        }
        function error(collection, response){
            console.log(response.responseText);
            //MyApp.vent.trigger("search:error", response);
        }
    },


    // Forms
    // ==============
    login: function(){
        App.Vent.trigger('layoutChange', {sidebarCollapsed: true});
        this.view = App.createForm('view/Login', {model: App.createForm('model/Login')});

        App.Helpers.renderContent(this.view.render().el);
    },

    logout: function(){
        //delete session and navigate to index
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

    //account: function(){
    //    App.Vent.trigger('layoutChange', {sidebarCollapsed: true});
    //    this.view = App.createLayout('view/Account').render();
    //},



    //page: function(id){
    //    var redirect = function(){
    //        return App.getRouter().navigate('', {trigger: true, replace: true});
    //    };
    //
    //    App.create('view/Popup', 'widget').render('sdfasdfsdf', {redirect: redirect});
    //
    //    console.log(id);
    //
    //
    //
    //
    //},

    addMedia: function(){

    }
    // ==============
});