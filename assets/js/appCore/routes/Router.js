App.Router = Backbone.Router.extend({
    routes: {
        '': 'index',
        '!/': 'index',
        '!/account/signin': 'signin',
        '!/account/login': 'login',
        '!/account/logout': 'logout',
        '!/account/recover': 'recover',
        //'!/page-:id': 'page',
        //'!/category-:id': 'category',
        //'!/add-media': 'addMedia'
    },

    index: function(){
        App.Vent.trigger('layoutUpdate');
        var collection = new App.Collections.Carts,
            view = new App.Views.Carts;
        collection.fetch({
            success: success,
            error: error
        });

        function success(){
            App.Vent.trigger('collectionLoad', collection);
            App.Helpers.renderContent(view.render().el);
        }
        function error(collection, response){
            console.log(response.responseText);
            //MyApp.vent.trigger("search:error", response);
        }
    },

    login: function(){
        App.Vent.trigger('layoutUpdateForce', {sidebar: false});
        var model = new App.Models.Forms.Login,
            view  = new App.Views.Forms.Login({model: model});

        App.Helpers.renderContent(view.render().el);
    },

    logout: function(){
        //delete session and navigate to index
        this.navigate('', {trigger: true, replace: true});
    },

    signin: function(){
        App.Vent.trigger('layoutUpdateForce', {sidebar: false});
        var model = new App.Models.Forms.Sigin,
            view  = new App.Views.Forms.Sigin({model: model});

        App.Helpers.renderContent(view.render().el);
    },

    recover: function(){
        App.Vent.trigger('layoutUpdateForce', {sidebar: false});
        var model = new App.Models.Forms.Recover,
            view  = new App.Views.Forms.Recover({model: model});

        App.Helpers.renderContent(view.render().el);
    },

    addMedia: function(){

    }



});