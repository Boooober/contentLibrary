App.set('view/Carts', 'layout', Backbone.View.extend({
    //className: 'row',
    el: '.main-content',



    initialize: function(){
        this.listenTo(App.Vent, 'collectionLoad', this.setCollection);
    },

    setCollection: function(collection){
        if(!this.collection){
            this.collection = collection;
            this.listenTo(this.collection, 'reset', this.render);
        }else{
            this.collection.reset(collection.models);
        }
    },

    render: function(){
        this.reset();
        this.collection.each(this.addOne, this);
        this.$el.html( this.$row.wrap('<div class="container-fluid" />').parent() );
        this.masonry();
        return this;
    },

    reset: function(){
        this.$el.html('');
        this.$row = $('<div class="row" />');
    },

    addOne: function(model){
        var view = App.create('view/Cart', 'content', {model: model});
        this.$row.append(view.render().el);
    },


    masonry: function(){
        //Find all external media resources
        var items = this.$('iframe, img, video'),
            l = items.length, count = 0;

        //Init masonry event handler function
        var masonry = function () {
            this.$row.masonry({
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

