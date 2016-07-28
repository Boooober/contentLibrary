App.set('model/Contact', 'form', App.get('model/BaseForm', 'form').extend({
    defaults: {
        name: '',
        email: '',
        message: '',
    },
    validate: function(attributes){
        console.log(attributes);
    },

    login: function(data){
        this.set(data);

        if (!this.isValid()) {
            console.log(this.validationError);
        }
    }
}));