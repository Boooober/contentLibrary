App.set('view/AccountDestroy', 'form', App.get('view/BaseForm', 'form').extend({

    template: App.Helpers.getTemplate('#profileDestroy'),

    events: {
        'click button': 'submit'
    },
    initialize: function(){
        this.model = App.getUser();
    },

    render: function(){
        this.setElement(this.template(this.model.toJSON()));
        return this;
    },

    submit: function(e){
        var $target = $(e.target);

        if($target.hasClass('destroy')){
            App.Vent.trigger('userLogout');
        }
        App.Vent.trigger('closePopup', this);
    }

}));