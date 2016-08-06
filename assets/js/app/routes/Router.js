App.Router = Backbone.Router.extend({
    routes: {
        '': 'index',
        '!/': 'index',
        '!/account/signin': 'signin',
        '!/account/login': 'login',
        '!/account/logout': 'logout',
        '!/account/recover': 'recover',
        '!/contacts': 'contacts',
        '!/account': 'account',
        '!/page/:id': 'page'
        //'!/page-:id': 'page',
        //'!/category-:id': 'category',
        //'!/add-media': 'addMedia'
    },

    index: function(){
        App.Vent.trigger('layoutUpdate');
        var collection = App.create('collection/Carts'),
            view = App.createLayout('view/Carts');
        collection.fetch({
            success: success,
            error: error
        });

        function success(){
            App.Vent.trigger('collectionLoad', collection);
            view.render();
        }
        function error(collection, response){
            console.log(response.responseText);
            //MyApp.vent.trigger("search:error", response);
        }
    },

    login: function(){
        App.Vent.trigger('layoutUpdateForce', {withSidebar: false});
        var model = App.createForm('model/Login'),
            view  = App.createForm('view/Login', {model: model});

        App.Helpers.renderContent(view.render().el);
    },

    logout: function(){
        //delete session and navigate to index
        this.navigate('', {trigger: true, replace: true});
    },

    signin: function(){
        App.Vent.trigger('layoutUpdateForce', {withSidebar: false});
        var model = App.createForm('model/Sigin'),
            view  = App.createForm('view/Sigin', {model: model});


        App.Helpers.renderContent(view.render().el);
    },

    recover: function(){
        App.Vent.trigger('layoutUpdateForce', {sidebar: false});
        var model = App.createForm('model/Recover'),
            view  = App.createForm('view/Recover', {model: model});

        App.Helpers.renderContent(view.render().el);
    },

    contacts: function(){
        App.Vent.trigger('layoutUpdateForce', {withSidebar: false});
        App.createLayout('view/Contacts').render();
    },

    account: function(){
        App.Vent.trigger('layoutUpdateForce');
        App.createLayout('view/Account').render();
    },

    page: function(id){
        console.log(id);

        


    },

    addMedia: function(){

    }

});