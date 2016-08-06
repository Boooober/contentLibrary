App.set('view/UserRates', 'content', App.get('view/BaseView').extend({
    initialize: function(){
        this.model = App.User.get();
    },
    template: App.Helpers.getTemplate('#userRates'),
    render: function(){
        this.$el.html( this.template() );
        return this;
    }
}));