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

        if(this.model.isVideo()) App.Events.on('layoutResize', this.scaleMedia, this);
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
        var scaleMedia = function(){
            var video = this.$('.video-frame iframe'),
                container = video.parent(),
                ratio = container.width() / video.attr('width'),
                height = video.attr('height') * ratio;

            container.css('padding-bottom', height);
        }.bind(this);

        $(document).ready(scaleMedia);
        $(window).resize(scaleMedia);
    }

});

App.Views.Carts = Backbone.View.extend({
    className: 'row',
    render: function(){
        this.collection.each(this.addOne, this);
        this.masonry();
        return this;
    },
    addOne: function(model){
        var cartView = new App.Views.Cart({model:model});
        this.$el.append(cartView.render().el);
    },
    masonry: function(){
        var masonry = function(){
            this.$el.masonry({
                columnWidth:this.$('.cart-item')[0],
                itemSelector: '.cart-item',
                percentPosition: true
            });
        }.bind(this);

        $(window).load(masonry);
        App.Events.on('layoutResize', masonry);
    }
});