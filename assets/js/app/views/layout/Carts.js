App.set('view/Carts', 'layout', Backbone.View.extend({
    className: 'row',

    initialize: function(){
        this.listenTo(App.Vent, 'collectionLoad', this.renderCollection);
    },

    renderCollection: function(collection){
        this.collection = collection;
        this.render();
    },

    render: function(){
        this.$el.html('');
        this.collection.each(this.addOne, this);
        App.Helpers.renderContent( this.$el.wrap('<div class="container-fluid" />').parent() );
        this.masonry();
        return this;
    },

    addOne: function(model){
        var view = App.create('view/Cart', 'content', {model: model});
        this.$el.append(view.render().el);
    },


    masonry: function(){
        //Find all external media resources
        var items = this.$('iframe, img, video'),
            l = items.length, count = 0;

        //Init masonry event handler function
        var masonry = function () {
            this.$el.masonry({
                columnWidth: this.$('.cart-item')[0],
                itemSelector: '.cart-item',
                percentPosition: true
            });
        }.bind(this);

        //Fire masonry init when all resourses are loaded
        items.load(function(){
            if(++count < l) return;
            masonry();
        });
        this.listenTo(App.Vent, 'layoutResize', masonry);
    }
}));

