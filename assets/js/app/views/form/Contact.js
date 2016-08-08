App.set('view/Contact', 'form', App.get('view/BaseForm', 'form').extend({
    initialize: function(){
        this.model = App.createForm('model/Contact');
        this.listenTo(this.model, 'change:success', this.showResponse);
    },
    template: App.Helpers.getTemplate('#contactForm'),

    render: function(){
        this.$el.html( this.template() );
        return this;
    },
    submit: function(e, data){
        this.model.set(data);
        this.model.send();
    },
    showResponse: function(){
        App.createWidget('Popup').render(this.model.response, {toggle: false, trigger: false});
        if(this.model.get('success')) this.clearInputs();
        this.model.clear({silent: true});
    }
}));