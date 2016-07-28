App.set('view/Recover', 'form', App.Views.Forms.BaseForm.extend({
    initialize: function(){},
    template: App.Helpers.getTemplate('#recoverForm'),
    render: function(){
        this.setElement( this.template() );
        return this;
    }
}));