App.set('model/Login', 'form', App.get('model/BaseForm', 'form').extend({
    defaults: {
        login: '',
        password: ''
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