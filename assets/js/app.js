/*
    Content types:
    0 - image
    1 - video
    2 - text
*/

var indexData = [
    {
        id: 1,
        type: 0,
        title: 'Image post 1',
        author: 'Nikita',
        mediaLink: '/assets/images/image_01.jpg',
        favorites: 15
    },
    {
        id: 2,
        type: 0,
        title: 'Image post 2',
        author: 'Nikita',
        mediaLink: '/assets/images/image_02.jpg',
        favorites: 23
    },
    {
        id: 3,
        type: 1,
        title: 'Video post 3',
        author: 'Nikita',
        mediaLink: '//www.youtube.com/embed/Scxs7L0vhZ4?rel=0&controls=0&showinfo=0&feature=oembed',
        favorites: 12
    },
    {
        id: 4,
        type: 2,
        title: 'Lorem ipsum',
        content: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pellentesque in nulla sit amet elementum. Nunc quis egestas tellus, vel aliquam mauris. Duis consectetur quam et diam mattis, at maximus lacus venenatis. Fusce vel neque imperdiet, varius metus eget, pharetra orci. Quisque tempus nunc et interdum sollicitudin. Nulla mattis dolor eu elit commodo, at egestas ipsum ultrices. Cras vel metus efficitur, aliquam purus sed, facilisis arcu.</p>',
        author: 'Nikita',
        //mediaLink: '',
        favorites: 16
    },
    {
        id: 5,
        type: 0,
        title: 'Image post 4',
        author: 'Nikita',
        mediaLink: '/assets/images/image_04.jpg',
        favorites: 23
    },
    {
        id: 6,
        type: 0,
        title: 'Image post 6',
        author: 'Nikita',
        mediaLink: '/assets/images/image_05.png',
        favorites: 20
    },
    {
        id: 7,
        type: 0,
        title: 'Image post 6',
        author: 'Nikita',
        mediaLink: '/assets/images/image_05.png',
        favorites: 20
    }
];
'use strict';

var App = {
    Models: {},
    Collections: {},
    Views: {},

    Helpers: {}
};


// Main wrapper of the page
// Contains sidebar and page layout
var wrapper;
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
        sidebarCollapsed: false
    },
    withSidebar: function(){
        return this.get('layout') === 'withSidebar';
    },
    sidebarCollapsed: function(){
        return this.get('sidebarCollapsed');
    },
    toggleSidebar: function(){
        this.set('sidebarCollapsed', !this.get('sidebarCollapsed'));
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
    template: App.Helpers.getTemplate('#sidebarLayout'),
    render: function(){
        this.setElement( this.template() );
        return this;
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
    toggleSidebar: function(){
        this.$el.toggleClass('sidebar-hide');
    }
});
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

        return this;
    },

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
    var layoutModel = new App.Models.Layout(),
        indexCarts = new App.Collections.Carts(indexData), //database
        carts = new App.Views.Carts({collection: indexCarts});

    wrapper = new App.Views.Wrapper({model: layoutModel});
    wrapper.render();

    $(window).load(function(e){
        wrapper.trigger('loaded', {e:e});
    });

    App.Helpers.renderContent(carts.render().el);
})();