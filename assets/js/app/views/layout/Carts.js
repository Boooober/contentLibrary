App.set('view/Cards', 'layout', App.get('view/BaseView').extend({
    className: 'row',

    subviews: {},

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
        App.Helpers.renderContent( this.$el );
        this.masonry();
        return this;
    },

    // Render every subview and save pointers to objects
    addOne: function(model, index){
        var view = App.create('view/Card', 'content', {model: model});

        this.subviews[index] = view;
        this.$el.append(view.render().el);
    },

    masonry: function(){
        //Find all external media resources
        var items = this.$('iframe, img, video'),
            l = items.length, count = 0;

        //Init masonry event handler function
        var masonry = function () {
            this.$el.masonry({
                columnWidth: this.$('.card-item')[0],
                itemSelector: '.card-item',
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

