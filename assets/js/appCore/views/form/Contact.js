App.set('view/Contact', 'form', App.Views.Forms.BaseForm.extend({
    initialize: function(){

    },
    template: App.Helpers.getTemplate('#contactForm'),
    successMessage: App.Helpers.getTemplate('#contactFormSuccess'),
    errorMessage: App.Helpers.getTemplate('#contactFormError'),

    render: function(){
        //this.$el.html( this.template() );
        //return this;
    },
    submit: function(){
        console.log('Contact form is submitting');
    }
}));