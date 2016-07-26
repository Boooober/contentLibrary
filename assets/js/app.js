'use strict';

var App = {
    Models: {},
    Collections: {},
    Views: {},

    Vent: {},

    Helpers: {}
};
App.Helpers = {

    renderContent: function(content){
        $('.page-content').html(content);
    },
    getTemplate: function(selector){
        return _.template($(selector).html());
    },

    getTypeTemplate: function(type){
        return this.getTemplate('#'+type+'Cart');
    },
    getQueryParam: function(param, source){
        var params, i, l, data;
        source = source || window.location.search.substring(1);
        if(!source) return '';

        params = source.split('&');
        for(i = 0, l = params.length; i<l; i++){
            data = params[i].split('=');
            if(data[0] === param) return data[1];
        }
        return '';
    }
};
_.extend(App.Vent, Backbone.Events);

/**
 *
 * - layoutResize: event fires when layout sizes changed.
 *   For example, sidebar toggle needs to reinit masonry
 *   and video scale.
 *
 * - collectionLoad: event fires when collection needs to be reloaded.
 *   Accepts collection data.
 *   For example, search, pagination, filter categories
 */

// BaseView for views with subviews.
// Extended with helpful methods for rendering DOM
App.Views.BaseView = Backbone.View.extend({

    //https://ianstormtaylor.com/assigning-backbone-subviews-made-even-cleaner
    //https://ianstormtaylor.com/rendering-views-in-backbonejs-isnt-always-simple
    //Render subviews with delegating events;
    assign: function(selector, view){
        var selectors;

        if(_.isObject(selector)){
            selectors = selector;
        } else {
            selectors = {};
            selectors[selector] = view;
        }

        if(!selectors) return;

        _.each(selectors, function(view, selector){
            //this.$(selector) -> save as this.$el.find(selector);
            view.setElement(this.$(selector)).render();
        }, this);
    }
});
App.Models.Layout = Backbone.Model.extend({
    defaults: {
        layout: 'withSidebar', //'withSidebar' or 'single'
        sidebarCollapsed: true
    },
    withSidebar: function(){
        return this.get('layout') === 'withSidebar';
    },
    sidebarCollapsed: function(){
        return this.get('sidebarCollapsed');
    },
    toggleSidebar: function(){
        this.set('sidebarCollapsed', !this.get('sidebarCollapsed'));

        //After end of toggle animation
        setTimeout(function(){
            App.Vent.trigger('layoutResize');
        }, 400);
    }
});
// Navigation menu

App.Views.Topmenu = App.Views.BaseView.extend({
    template: App.Helpers.getTemplate('#topMenu'),
    render: function(){
        this.$el.html( this.template() );
        return this;
    }
});



// Sidebar layout

App.Views.SidebarLayout = App.Views.BaseView.extend({
    initialize: function(){
        this.model.on('change:sidebarCollapsed', this.toggleSidebar, this);
        this.subviews['.searchform'] = new App.Views.SearchForm({model: new App.Models.SearchForm});
    },
    subviews: {},
    template: App.Helpers.getTemplate('#sidebarLayout'),
    render: function(){
        this.setElement( this.template() );
        this.assign( this.subviews );
        return this;
    },
    toggleSidebar: function(){
        this.$('.side-content').fadeToggle(150);
    }
});



// Content layout
// This layout includes top navigation menu, dynamic content wrapper and footer

App.Views.ContentLayout = App.Views.BaseView.extend({
    initialize: function(){
        this.subviews['.topmenu'] = new App.Views.Topmenu;
    },
    events: {
        'click .sidebar-toggle': 'toggleSidebar'
    },
    subviews: {},

    template: App.Helpers.getTemplate('#pageLayout'),
    render: function () {
        this.setElement(this.template());
        this.assign(this.subviews);
        return this;
    },

    toggleSidebar: function(){
        this.model.toggleSidebar();
    }
});


// Main wrapper

App.Views.Wrapper = App.Views.BaseView.extend({
    el: '#wrapper',
    initialize: function(){

        this.on('loaded', this.loaded, this);
        this.model.on('change:sidebarCollapsed', this.toggleSidebar, this);

        if(this.model.withSidebar()){
            this.$el.addClass('with-sidebar');
            this.subviews[0] = new App.Views.SidebarLayout({model: this.model});

            if(this.model.sidebarCollapsed())
                this.$el.addClass('sidebarCollapsed');
        }
        this.subviews[1] = new App.Views.ContentLayout({model: this.model});
    },
    subviews: {},
    template: App.Helpers.getTemplate('#wrapperAppends'),
    render: function(){
        _.each(this.subviews, function(subview){
            this.$el.append(subview.render().el);
        }, this);
        this.$el.append( this.template() );
    },

    loaded: function(e){
        this.$('.preloader').fadeOut();
    },

    // Resize layouts width
    toggleSidebar: function(){
        this.$el.toggleClass('sidebar-hide');
    }
});
App.Models.SearchForm = Backbone.Model.extend({
    defaults: {
        s: App.Helpers.getQueryParam('s')
    },
    search: function(s){
        var collection = new App.Collections.Carts;
        this.set('s', s);

        collection.fetch({
            success: function(){

                if(s){
                    collection.reset(collection.filter(function(model){
                        return model.get('title').search(s) !== -1 ||
                        model.get('content').search(s) !== -1
                    }));
                }

                App.Vent.trigger('collectionLoad', collection);
            }
        });
    }
});
App.Views.SearchForm = App.Views.BaseView.extend({
    events: {
        'submit form': 'submit'
    },
    template: App.Helpers.getTemplate('#searchform'),
    render: function(){
        this.$el.html( this.template( this.model.toJSON() ) );
        return this;
    },
    submit: function(e){
        e.preventDefault();
        var s = $(e.target).find("input[name='s']").val();
        this.model.search(s);
    }
});
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
    },

    isImage: function(){
        return this.get('type') === 0;
    },

    isVideo: function(){
        return this.get('type') === 1;
    },

    isText: function(){
        return this.get('type') === 2;
    }

});
App.Collections.Carts = Backbone.Collection.extend({
    //initialize: function(){
    //    this.listenTo(App.Vent, 'collectionLoad', this.search);
    //},
    url: 'assets/js/database/carts.json',
    model:App.Models.Cart,

    search: function(query){
        if(!query) return this;
        var result = this.filter(function(model){
            return model.get('title').search(query) !== -1 ||
                model.get('content').search(query) !== -1
        });
        return new App.Collections.Carts(result);
    }

});

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
        this.listenTo(App.Vent, 'collectionLoad', this.setCollection);
    },

    setCollection: function(collection){
        if(!this.collection){
            this.collection = collection;
            this.listenTo(this.collection, 'reset', this.redraw);
        }else{
            this.collection.reset(collection.models);
        }
    },

    render: function(){
        this.collection.each(this.addOne, this);
        this.masonry();
        return this;
    },
    addOne: function(model){
        var cartView = new App.Views.Cart({model:model});
        this.$el.append(cartView.render().el);
    },

    redraw: function(){
        this.reset().render();
    },

    reset: function(){
        this.$el
            .html('')
            .masonry('destroy');
        return this;
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
            masonry();
        });
        this.listenTo(App.Vent, 'layoutResize', masonry);
    },

    //search: function(options){
    //    //this.reset();
    //    this.update( this.collection.search(options.s) );
    //}

});
(function(){
    var layoutModel = new App.Models.Layout(),
        wrapper = new App.Views.Wrapper({model: layoutModel}),
        collection = new App.Collections.Carts,
        carts = new App.Views.Carts;

    collection.fetch({
        success: success,
        error: error
    });

    wrapper.render();
    $(window).load(function(e){
        wrapper.trigger('loaded', {e:e});
    });

    function success(){
        App.Vent.trigger('collectionLoad', collection);
        App.Helpers.renderContent(carts.render().el);
    }
    function error(collection, response){
        console.log(response.responseText);
        //MyApp.vent.trigger("search:error", response);
    }

})();