App.set('view/CartInPopup', 'content', App.get('view/BaseCart', 'content').extend({
    template: App.Helpers.getTemplate('#cartInPopup'),
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        if(this.model.isVideo()) this.scaleMedia();
        return this;
    }
}));


