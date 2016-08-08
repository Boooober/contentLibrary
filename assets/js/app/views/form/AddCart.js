App.set('view/AddCart', 'form', App.get('view/BaseForm', 'form').extend({

    template: App.Helpers.getTemplate('#addCart'),

    initialize: function(){
        this.model = this.model ? this.model : App.createContent('model/Cart');
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
        App.Vent.trigger('closePopup', this);
    }

}));