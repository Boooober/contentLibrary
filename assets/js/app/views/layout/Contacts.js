App.set('view/Contacts', 'layout', App.get('view/BaseView').extend({
    template: App.Helpers.getTemplate('#contactPage'),
    initSubviews: function(){
        this.subviews = {
            '.contact-form': App.createForm('view/Contact', App.createForm('model/Contact')),
            '.google-map': App.create('view/GoogleMap', 'widget')
        };
        return this.subviews;
    },
    render: function(){
        this.setElement( this.template() );
        this.assign( this.initSubviews() );
        App.Helpers.renderContent(this.el);
        return this;
    }
}));