App.set('view/Recover', 'form', App.get('view/BaseForm', 'form').extend({
    initialize: function(){},
    template: App.Helpers.getTemplate('#recoverForm'),
    render: function(){
        this.setElement( this.template() );
        return this;
    }
}));