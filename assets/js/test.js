var Helper = {
        template: function(selector){
            return _.template($(selector).html());
        }
    };



//Models
var AppState = Backbone.Model.extend({
        defaults: {
            username: '',
            state: 'start'
        }
    });
var appState = new AppState;

var UserModel = Backbone.Model.extend({
    defaults:{
        name: ''
    }
});

//Collections
var UsersCollection = Backbone.Collection.extend({
    model: UserModel,
    checkUser: function(username){
        var searchResult = this.find(function(user){
            return user.get('name') === $.trim(username);
        });

        console.log(searchResult);
        return searchResult != null;
    }
});

var friends = new UsersCollection([
    {name:'Pij'},
    {name:'Shlusina'},
    {name:'Maria'},
    {name:'Bogdan'}
]);


//Routers
var Router = Backbone.Router.extend({
    routes: {
        "": "start", // Пустой hash-тэг
        "!/": "start", // Начальная страница
        "!/success": "success", // Блок удачи
        "!/error": "error" // Блок ошибки
    },

    start: function () {
        appState.set({state: 'start'});
    },

    success: function () {
        appState.set({state: 'success'});
    },

    error: function () {
        appState.set({state: 'error'});
    }
});

var router = new Router(); // Создаём контроллер
Backbone.history.start();  // Запускаем HTML5 History push



//Views
var Block = Backbone.View.extend({
    el: '#block',
    templates: {
        start: Helper.template('#start'),
        success: Helper.template('#success'),
        error: Helper.template('#error')
    },

    //Subscribe on model change events
    initialize: function(){
        this.model.on('change', this.render, this);
    },
    render: function(){
        var state = this.model.get('state');
        this.$el.html( this.templates[state](this.model.toJSON()) );
        return this;
    },
    events:{
        'click input:button': 'check'
    },
    check: function(){
        var username = this.$el.find('input:text').val(),
            find = friends.checkUser(username);

         this.model.set({
            state: find ? 'success' : 'error',
            username: username
        });
    }
});

var block = new Block({model:appState});

appState.trigger('change');

appState.on('change:state', function(){
    var state = this.get('state');

    state === 'start' ?
        router.navigate('!/', {trigger: false}) :
        router.navigate('!/'+state, {trigger: false});
});
