App.set('view/UserProfile', 'content', App.get('view/BaseView').extend({
    initialize: function(){
        this.model = App.User.get();
    },
    template: App.Helpers.getTemplate('#userProfile'),
    render: function(){
        this.$el.html( this.template() );
        return this;
    }
}));