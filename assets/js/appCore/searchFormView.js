App.Views.SearchForm = App.Views.BaseView.extend({
    template: App.Helpers.getTemplate('#searchform'),
    render: function(){
        this.$el.html( this.template( this.model.toJSON() ) );
        return this;
    }
});