App.set('view/Search', 'form', Backbone.View.extend({
    initialize: function(){
        this.model = App.createForm('model/Search');
    },
    events: {
        "submit form": 'submit',
        "keyup [name='s']": 'keyup'
    },
    template: App.Helpers.getTemplate('#searchform'),

    render: function(){
        this.$el.html( this.template( this.model.toJSON() ) );
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
        this.model.search(s);
        //App.Vent.trigger('searching');
    }
}));