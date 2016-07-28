App.set('model/Signin', 'form', App.get('model/BaseForm', 'form').extend({
    defaults: {
        login: '',
        email: '',
        password: '',
        password2: ''
    },

    validate: function(attributes){

    },

    signin: function(){

    }
}));