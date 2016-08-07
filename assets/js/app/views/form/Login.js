App.set('view/Login', 'form', App.get('view/BaseForm', 'form').extend({
    initialize: function(){
        this.listenTo(App.Vent, 'loginFailed', this.showFail);
    },
    template: App.Helpers.getTemplate('#loginForm'),
    render: function(){
        this.setElement( this.template() );
        return this;
    },
    submit: function(e, data){
        this.model.set(data);
        this.model.login();
    },

    showFail: function(){
        console.log('login attempt failed');
    }
}));