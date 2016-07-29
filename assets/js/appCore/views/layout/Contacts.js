App.set('view/Contacts', 'layout', App.get('view/BaseView').extend({
    el: '.main-content',
    template: App.Helpers.getTemplate('#contactPage'),
    initSubviews: function(){
        this.subviews = {
            '.contact-form': App.createForm('view/Contact', App.createForm('model/Contact')),
            '.google-map': App.create('view/GoogleMap', 'widget')
        };
        return this.subviews;
    },
    render: function(){
        this.$el.html( this.template() );
        this.assign( this.initSubviews() );
        return this;
    }
}));