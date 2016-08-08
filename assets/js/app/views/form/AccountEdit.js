App.set('view/AccountEdit', 'form', App.get('view/BaseForm', 'form').extend({

    template: App.Helpers.getTemplate('#profileEdit'),

    events: {
        'change .account-avatar': 'loadImage'
    },

    initialize: function(){
        this.model = App.getUser();
        this.extendParentEvents(this.events);
    },

    /**
     *
     * @param {[bool]} inPopup
     * @param {[Object]} options for popup
     * @returns {*}
     */
    render: function(inPopup, options){
        this.setElement(this.template(this.model.toJSON()));
        if(inPopup) App.createWidget('Popup').render(this, options);
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
        data = _.reduce(data, function(obj, value, key){
            if(value || value === 0)
                obj[key] = value;
            return obj;
        }, {});
        this.model.set(data);
    }

}));