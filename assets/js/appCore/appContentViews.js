// Cart toolbox view
App.Views.CartToolbox = App.Views.BaseView.extend({

    initialize: function() {
        this.model.on('change:favorites', this.render, this);
    },
    events: {
        'click .rate-button': 'toggleRate'
    },
    template: App.Helpers.getTemplate('#cartToolbox'),

    render: function(){
        this.$el.html( this.template( this.model.toJSON() ) );
        return this;
    },

    toggleRate: function(e){
        e.preventDefault();
        this.model.favoriteToggle();
    }
});


App.Views.Cart = App.Views.BaseView.extend({
    initialize: function(){
        //this.model.on('change:favorite', this.render, this);
        this.subviews['.toolbox'] = new App.Views.CartToolbox({model: this.model});
    },
    subviews: {},

    //There are three content types:
    //0 => image, 1 => video, 3 => text
    //They are stored in array by indexes
    templates: [
        App.Helpers.getTypeTemplate('image'),
        App.Helpers.getTypeTemplate('video'),
        App.Helpers.getTypeTemplate('text')
    ],

    render: function(){
        var model = this.model.toJSON(),
            template = this.templates[model.type](model);

        this.setElement($(template));
        this.assign(this.subviews);

        if(this.model.isVideo()) this.scaleMedia();

        return this;
    },

    scaleMedia: function(){
        var video = this.$('.video-frame iframe'),
            container = video.parent();
        var scaleMedia = function(){
            var ratio = container.width() / video.attr('width'),
                height = video.attr('height') * ratio;

            container.css('padding-bottom', height);
        }.bind(this);

        video.load(scaleMedia);
        $(window).resize(scaleMedia);
        this.listenTo(App.Vent, 'layoutResize', scaleMedia);
    }

});

App.Views.Carts = Backbone.View.extend({
    className: 'row',

    initialize: function(){
        this.listenTo(App.Vent, 'collectionFilter', this.search);


    },
    render: function(collection){
        collection = collection || this.collection;
        collection.each(this.addOne, this);
        this.masonry();
        return this;
    },
    addOne: function(model){
        var cartView = new App.Views.Cart({model:model});
        this.$el.append(cartView.render().el);
    },

    reset: function(){
        this.$el.html('')
            .masonry('destroy');
        //this.undelegateEvents();
    },

    masonry: function(){
        //Find all external media resources
        var items = this.$('iframe, img, video'),
            l = items.length, count = 0,

            //Init masonry event handler function
            masonry = function () {
                this.$el.masonry({
                    columnWidth: this.$('.cart-item')[0],
                    itemSelector: '.cart-item',
                    percentPosition: true
                });
            }.bind(this);

        //Fire masonry init when all resourses are loaded
        items.load(function(){
            if(++count < l) return;
            console.log('all resourses are loaded! init masonry...');
            masonry();
        });
        this.listenTo(App.Vent, 'layoutResize', masonry);
    },

    search: function(options){
        this.reset();
        this.render( this.collection.search(options.s) );
    }

});