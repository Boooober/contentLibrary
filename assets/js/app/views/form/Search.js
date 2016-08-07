App.set('view/Search', 'form', Backbone.View.extend({
    events: {
        "submit form": 'submit',
        "keyup [name='s']": 'keyup'
    },
    template: App.Helpers.getTemplate('#searchform'),

    render: function(){
        this.$el.html( this.template() );
        return this;
    },
    keyup: function(e){
        var s = $(e.target).val();
        if(s.length > 2) this.search(s);
    },

    submit: function(e){
        e.preventDefault();
        var s = $(e.target).find("input[name='s']").val();
        this.search(s);
    },

    search: function(s){
        var router = App.getRouter();
        s.length > 0 ?
            router.navigate('!/search/'+s, {trigger: true}) :
            router.navigate('', {trigger: true});
    }
}));