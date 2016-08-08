App.set('view/CardInPopup', 'content', App.get('view/BaseCard', 'content').extend({
    template: App.Helpers.getTemplate('#cardInPopup'),
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        if(this.model.isVideo()) this.scaleMedia();
        return this;
    }
}));


