App.set('view/Login', 'form', App.get('view/BaseForm', 'form').extend({
    initialize: function(){},
    template: App.Helpers.getTemplate('#loginForm'),
    render: function(){
        this.setElement( this.template() );
        return this;
    }
}));