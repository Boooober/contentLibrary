App.set('view/Account', 'layout', App.get('view/BaseView').extend({
    el: '.main-content',
    template: App.Helpers.getTemplate('#account'),
    initSubviews: function(){
        this.subview = {
            '.user-profile': App.create('view/UserProfile', 'content'),
            '.user-rates': App.create('view/UserRates', 'content')
        };
        return this.subview;
    },
    render: function(){
        this.$el.html( this.template() );
        this.assign( this.initSubviews() );
        return this;
    }
}));