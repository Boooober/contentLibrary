App.Views.SearchForm = App.Views.BaseView.extend({
    events: {
        'submit form': 'submit'
    },
    template: App.Helpers.getTemplate('#searchform'),
    render: function(){
        this.$el.html( this.template( this.model.toJSON() ) );
        return this;
    },
    submit: function(e){
        e.preventDefault();
        var s = $(e.target).find("input[name='s']").val();
        this.model.search(s);
    }
});