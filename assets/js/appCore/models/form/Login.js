App.set('model/Login', 'form', App.Models.Forms.BaseForm.extend({
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