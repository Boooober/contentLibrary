App.set('view/Account', 'layout', App.get('view/BaseView').extend({
    template: App.Helpers.getTemplate('#account'),
    initSubviews: function(){
        this.subview = {
            '.user-profile': App.create('view/UserProfile', 'content'),
            '.user-rates': App.create('view/UserRates', 'content')
        };
        return this.subview;
    },
    render: function(){
        this.setElement( this.template() );
        this.assign( this.initSubviews() );
        App.Helpers.renderContent(this.el);
        return this;
    }
}));