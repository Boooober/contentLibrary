App.set('view/AccountEdit', 'form', App.get('view/BaseForm', 'form').extend({

    template: App.Helpers.getTemplate('#profileEdit'),

    events: {
        'change .account-avatar': 'loadImage'
    },

    initialize: function(){
        this.model = App.getUser();
        this.extendParentEvents(this.events);
    },

    render: function(){
        this.setElement(this.template(this.model.toJSON()));
        return this;
    },

    loadImage: function(e){
        var $target = $(e.target),
            image = $target.prop('files')[0],
            reader = new FileReader();

        if(image){
            reader.onload = function(e){
                this.$('img').attr('src', e.target.result);
            }.bind(this);
            reader.readAsDataURL(image);
        }
    },

    submit: function(e, data){
        this.model.set(data);
        App.Vent.trigger('closePopup', this);
    }

}));