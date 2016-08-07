App.set('model/Login', 'form', App.get('model/BaseForm', 'form').extend({
    defaults: {
        username: '',
        password: ''
    },

    login: function(){

        // Front-end user login...
        var identity = this.toJSON(),
            users = App.create('collection/Users');

        users.fetch({
            success: success,
            error: error
        });

        function success(collection){
            var user = collection.findWhere(identity);
            user ?
                App.Vent.trigger('loginSuccess', user) :
                App.Vent.trigger('loginFailed');
        }
        function error(collection, response){
            console.log(response.responseText);
            //MyApp.vent.trigger("search:error", response);
        }





        console.log(this.toJSON());
    }
}));