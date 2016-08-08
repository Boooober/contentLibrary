App.set('view/CardPage', 'layout', App.get('view/BaseCard', 'content').extend({

    className: 'container-fluid',
    template: App.Helpers.getTemplate('#cardPage'),
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