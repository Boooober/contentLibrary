App.set('view/AddCard', 'form', App.get('view/BaseForm', 'form').extend({

    template: App.Helpers.getTemplate('#addCard'),

    initialize: function(){
        this.model = this.model ? this.model : App.createContent('model/Card');
        this.extendParentEvents(this.events);
    },
    events: {

    },

    render: function(){
        this.setElement(this.template(this.model.toJSON()));
        return this;
    },

    submit: function(e, data){
        this.model.set(data);
    }

}));