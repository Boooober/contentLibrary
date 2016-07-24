var App = {
    Models: {},
    Collections: {},
    Views: {},

    Helpers: {}
};
App.Helpers = {

    renderContent: function(content){
        $('.page-content').html(content);
    },
    getTemplate: function(selector){
        return _.template($(selector).html());
    },

    getTypeTemplate:function(type){
        return this.getTemplate('#'+type+'Cart');
    }
};
/**
 * Created by Boooober on 22.07.2016.
 */

/**
 * Created by Boooober on 22.07.2016.
 */

/**
 * Cart model
 */
App.Models.Cart = Backbone.Model.extend({
    defaults: {
        id: '',
        type: '',

        title: '',
        content: '',
        author: '',
        mediaLink: '',
        favorites: 0,

        isFavorite: false
    },

    favoriteToggle: function(){
        var count = this.get('favorites'),
            favorite = this.get('isFavorite');

        this.set('isFavorite', !favorite);
        this.set('favorites', favorite ? --count : ++count);
    }

});
App.Collections.Carts = Backbone.Collection.extend({
    model:App.Models.Cart
});

// BaseView for views with subviews.
// Extended with helpful methods for rendering DOM
App.Views.BaseView = Backbone.View.extend({

    //https://ianstormtaylor.com/assigning-backbone-subviews-made-even-cleaner
    //https://ianstormtaylor.com/rendering-views-in-backbonejs-isnt-always-simple
    //Render subviews with delegating events;
    assing: function(selector, view){
        var selectors, self = this;

        if(_.isObject(selector)){
            selectors = selector;
        } else {
            selectors = {};
            selectors[selector] = view;
        }

        if(!selectors) return;

        _.each(selectors, function(view, selector){
            //this.$(selector) -> save as this.$el.find(selector);
            view.setElement(self.$(selector)).render();
        });
    }
});



// Views for rendering main content items

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
        this.subviews.toolbox = new App.Views.CartToolbox({model: this.model});
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
        this.assing({
           '.toolbox': this.subviews.toolbox
        });

        return this;
    }
});

App.Views.Carts = Backbone.View.extend({
    className: 'row',
    render: function(){
        this.collection.each(this.addOne, this);
        return this;
    },
    addOne: function(model){
        var cartView = new App.Views.Cart({model:model});
        this.$el.append(cartView.render().el);
    }
});
(function(){
    var indexCarts = new App.Collections.Carts(indexData);
    var carts = new App.Views.Carts({collection: indexCarts});
    App.Helpers.renderContent(carts.render().el);
})();