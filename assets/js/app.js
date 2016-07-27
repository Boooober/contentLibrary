'use strict';

var App = {
    Models: {
        Forms: {}
    },
    Collections: {},
    Views: {
        Forms: {}
    },

    Vent: {},

    Helpers: {}
};
_.extend(App.Vent, Backbone.Events);

/**
 *
 * Layout events
 * -------------
 *
 *** layoutResize: event fires when layout sizes changed.
 *   For example, sidebar toggle needs to reinit masonry and video scale.
 *
 *** layoutUpdate: fire this event to change users layout options.
 *   After success update, this event triggers layoutRender.
 *   For example, to hide sidebar from display and save this option to localStorage.
 *
 *** layoutForceUpdate: change layout options, but do not save them anywhere.
 *   After success update, this event triggers layoutRender.
 *   Fire this event to change layout for current page.
 *   For example, {sidebar: false} to remove sidebar.
 *
 *** layoutRender: event fires from router to create page layout.
 *   If you need to change layout options before render, use
 *   layoutUpdate or layoutForceUpdate
 *
 * Collection events
 * -----------------
 *
 *** collectionLoad: event fires when collection needs to be reloaded.
 *   Accepts collection data.
 *   For example, search, pagination, filter categories
 */

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

        params = source.search('&') !== -1 ? source.split('&') : source.split('; ');
        for(i = 0, l = params.length; i<l; i++){
            data = params[i].split('=');
            if(new RegExp(param, 'i').test(data[0])) return data[1];
        }
        return '';
    },
    storage: function(storeName){
        return (function(){
            var storeAPI,
                hasStorage = (function() {
                    try {
                        localStorage.setItem('test', 'hello');
                        localStorage.removeItem('test');
                        return true;
                    } catch (exception) {
                        return false;
                    }
                }());

            function getArgs(){
                var name, value;
                switch (arguments.length){
                    case 1:
                        name = storeName;
                        value = JSON.stringify(arguments[0]);
                        break;
                    case 2:
                        name = arguments[0];
                        value = JSON.stringify(arguments[1]);
                        break;
                    default:
                        return false;
                }
                return {
                    name: name,
                    value: value
                };
            }

            if(hasStorage)
                // Local storage get/set API
                storeAPI = {
                    set: function(){
                        var args = getArgs.apply(this, arguments);
                        if(args){
                            localStorage[args.name] = args.value;
                            return true;
                        }
                        return false;
                    },
                    get: function(option){
                        option = option || storeName;
                        return JSON.parse(localStorage[option] || '{}');
                    }
                };
            else
                // Cookie get/set API
                storeAPI = {
                    set: function(){
                        var args = getArgs.apply(this, arguments),
                            date = new Date(new Date().getTime() + 30 * 24 * 3600 * 1000);
                        if(args){
                            document.cookie = args.name+'='+args.value+'; path=/; expires='+date.toUTCString();
                            return true;
                        }
                        return false;
                    },
                    get: function(option){
                        option = option || storeName;
                        return JSON.parse(App.Helpers.getQueryParam(option, document.cookie) || '{}');
                    }
                };
            return storeAPI;
        })();
    }
};
App.Models.Forms.Search = Backbone.Model.extend({
    defaults: {
        login: '',
        password: ''
    },

    validate: function(attributes){

    },

    login: function(){

    },

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
                var pattern;

                if(s){
                    pattern = new RegExp(s, 'i');
                    collection.reset(collection.filter(function(model){
                        return pattern.test(model.get('title')) || pattern.test(model.get('description'));
                    }));
                }

                App.Vent.trigger('collectionLoad', collection);
            }
        });
    }
});
/**
 * Cart model
 */
App.Models.Cart = Backbone.Model.extend({
    defaults: {
        type: 0,
        title: '',
        description: '',
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
App.Models.Layout = Backbone.Model.extend({
    storage: App.Helpers.storage('Layout'),

    initialize: function(){
        this.loadOptions();
        this.listenTo(App.Vent, 'layoutUpdate', this.update);
        this.listenTo(App.Vent, 'layoutUpdateForce', this.updateForce);
    },
    defaults: {
        sidebar: true,
        sidebarCollapsed: true
    },

    // Save model options
    // and save it to localStorage/cookie
    update: function(options, render){
        this.updateOptions(options);
        this.updateForce(options, render);
    },

    // Set layout options for current view
    updateForce: function(options, render){
        render = _.isBoolean(render) ? render : true;
        if(options) this.set(options);
        if(render) App.Vent.trigger('layoutRender');
    },

    //Functions predicates
    withSidebar: function(){
        return this.get('sidebar');
    },
    sidebarCollapsed: function(){
        return this.get('sidebarCollapsed');
    },

    //Trigger function
    toggleSidebar: function(){
        this.update({sidebarCollapsed: !this.get('sidebarCollapsed')}, false);
        //this.set('sidebarCollapsed', );

        //After end of css toggle animation
        setTimeout(function(){
            App.Vent.trigger('layoutResize');
        }, 400);
    },

    loadOptions: function(){
        this.set( this.storage.get() );
    },

    saveOptions: function(options){
        this.set(options);
        this.storage.set(this.toJSON());
    },

    updateOptions: function(options){
        // load default options from storage
        this.loadOptions();
        // save new options to storage and model
        this.saveOptions(options);
    }
});
App.Collections.Carts = Backbone.Collection.extend({
    url: 'assets/js/database/carts.json',
    model:App.Models.Cart
});

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
            view.setElement(this.$(selector)).render();
        }, this);
    }
});
App.Views.SearchForm = App.Views.BaseView.extend({
    events: {
        "submit form": 'submit',
        "keyup [name='s']": 'keyup'
    },
    template: App.Helpers.getTemplate('#searchform'),

    render: function(){
        this.$el.html( this.template( this.model.toJSON() ) );
        return this;
    },
    keyup: function(e){
        var s = $(e.target).val();
        if(s.length > 2) this.search(s);
    },

    submit: function(e){
        e.preventDefault();
        var s = $(e.target).find("input[name='s']").val();
        this.search(s);

    },

    search: function(s){
        this.model.search(s);
        //App.Vent.trigger('searching');
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
    initSubviews: function(){
        this.subviews = {};
        this.subviews['.toolbox'] = new App.Views.CartToolbox({model: this.model});
        return this.subviews;
    },

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
        this.assign( this.initSubviews() );

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
        var models = this.collection.models,
            $root = this.$el, items,
            view, $el, i, l;

        //$root.masonry({
        //    itemSelector: '.cart-item',
        //    columnWidth: $el[0],
        //    percentPosition: true
        //});


        i = 0;
        l = models.length;
        (function addByOne(model){
            view = new App.Views.Cart({model: model});
            $el = view.render().$el;
            $root.append($el);

            //Init masonry layout
            if(i === 0){


                setTimeout(function(){
                    $root.masonry({
                        itemSelector: '.cart-item',
                        columnWidth: $el[0],
                        percentPosition: true
                    });
                },0);

            }



            if((items = $el.find('img, iframe, video')).length !== 0){
                items.on('load', masonryItem);
            }else{
                masonryItem();
            }

            // Recursion load next item
            function masonryItem(){
                $root.masonry('appended', $el);
                if(++i < l) addByOne(models[i]);
            }

        })(models[i]);

        this.listenTo(App.Vent, 'layoutResize', function(){
            $root.masonry();
        });

        return this;
    },


    redraw: function(){
        this.reset().render();
    },

    reset: function(){
        this.$el.html('');
        return this;
    }

    //masonry: function(){
    //    //Find all external media resources
    //    var items = this.$('iframe, img, video'),
    //        l = items.length, count = 0;
    //
    //    //Init masonry event handler function
    //    var masonry = function () {
    //        this.$el.masonry({
    //            columnWidth: this.$('.cart-item')[0],
    //            itemSelector: '.cart-item',
    //            percentPosition: true
    //        });
    //    }.bind(this);
    //
    //    //Fire masonry init when all resourses are loaded
    //    items.load(function(){
    //        if(++count < l) return;
    //        masonry();
    //    });
    //    this.listenTo(App.Vent, 'layoutResize', masonry);
    //}

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
        this.$('.side-wrapper').slimScroll({
            height: '100%'
        });
        return this;
    },
    toggleSidebar: function(){
        this.model.get('sidebarCollapsed') ?
            this.$('.side-content').fadeOut(150) :
            this.$('.side-content').hide().delay(300).fadeIn(150);
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
        this.listenTo(App.Vent, 'layoutRender', this.render);
        this.model.on('change:sidebarCollapsed', this.toggleSidebar, this);
    },


    initSubviews: function(){
        this.subviews = [];
        if(this.model.withSidebar()){
            this.$el.addClass('with-sidebar');
            this.subviews.push(new App.Views.SidebarLayout({model: this.model}));

            if(this.model.sidebarCollapsed())
                this.$el.addClass('sidebar-collapsed');
        }
        this.subviews.push( new App.Views.ContentLayout({model: this.model}));
    },

    template: App.Helpers.getTemplate('#wrapperAppends'),

    render: function(){
        this.$el.html('').removeClass();
        this.initSubviews();

        _.each(this.subviews, function(subview){
            this.$el.append(subview.render().el);
        }, this);
        this.$el.append( this.template() );
    },

    // Resize layouts width
    toggleSidebar: function(){
        this.$el.toggleClass('sidebar-collapsed');
    }

});
App.Router = Backbone.Router.extend({
    routes: {
        '': 'index',
        '!/': 'index',
        '!/login': 'login',
        //'!/sigin': 'sigin',
        //'!/page-:id': 'page',
        //'!/category-:id': 'category',
        //'!/add-media': 'addMedia'
    },

    index: function(){
        App.Vent.trigger('layoutUpdate');
        console.log('index route');

        //console.log('index');
        var collection = new App.Collections.Carts,
            carts = new App.Views.Carts;
        collection.fetch({
            success: success,
            error: error
        });

        function success(){
            App.Vent.trigger('collectionLoad', collection);
            App.Helpers.renderContent(carts.render().el);
        }
        function error(collection, response){
            console.log(response.responseText);
            //MyApp.vent.trigger("search:error", response);
        }
    },

    login: function(){
        App.Vent.trigger('layoutUpdateForce', {sidebar: false});
        console.log('login route');
    }


});
new App.Views.Wrapper({
    model: new App.Models.Layout()
});
new App.Router;
Backbone.history.start();
