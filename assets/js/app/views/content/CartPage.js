App.set('view/CartPage', 'layout', App.get('view/BaseCart', 'content').extend({

    className: 'container-fluid',
    template: App.Helpers.getTemplate('#cartPage'),
    initialize: function(){
        this.listenTo(App.Vent, 'modelLoad', this.render);
    },
    render: function(model){
        this.model = model;
        this.$el.html( this.template(model.toJSON()) );
        App.Helpers.renderContent(this.el);
        return this;
    }
}));