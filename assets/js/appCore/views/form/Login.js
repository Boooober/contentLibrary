App.set('view/Login', 'form', App.Views.Forms.BaseForm.extend({
    initialize: function(){},
    template: App.Helpers.getTemplate('#loginForm'),
    render: function(){
        this.setElement( this.template() );
        return this;
    }
}));