'use strict';

var App = {

    //Namespace app structure
    //Models: {
    //    Forms: {},
    //    Content: {},
    //    Layouts: {}
    //},
    //Collections: {},
    //Views: {
    //    Forms: {},
    //    Content: {},
    //    Layouts: {}
    //},
    Vent: {},
    Helpers: {},

    /**
     * Methods below are shortcuts for App namespase structure
     * @param namespace - string which contains type/name of object. Example: Model/Sidebar
     * @param {Object} config - attributes/properties that will be set to new object instance
     * @returns {(Object|undefined)}
     */
    createForm: function(namespace, config){
        return this.create(namespace, 'Forms', config)
    },
    createLayout: function(namespace, config){
        return this.create(namespace, 'Layouts', config)
    },
    createContent: function(namespace, config){
        return this.create(namespace, 'Content', config)
    },

    /**
     * This method designed for simple creating new object instances from App namespace.
     *
     * Accept three paramets in arguments object:
     *
     * {string} arguments[0] = namespace of object - Model/[name of the object];
     * {string} arguments[1] = type of object (optional) - Layout/[optional namespace]
     * {Object} arguments[2] = Object constructor params
     *
     * First two params define object namespace, so thay must be the save as params from declaration this object
     *
     */
    create: function(/*namespace, [type], config*/){
        var args = [].slice.call(arguments);
        if(args.length === 2) args.splice(1,0,undefined);

        //var object = this.get.apply(this, args);
        //if(object) return new object(args[2]);
    },

    /**
     * This method designed for simple getting objects from App namespace.
     *
     * Accept three paramets in arguments object:
     *
     * {string} arguments[0] = namespace of object - Model/[name of the object];
     * {string} arguments[1] = type of object (optional) - Layout/[optional namespace]
     *
     * This two params define object namespace, so thay must be the same as params from declaration this object
     *
     */
    get: function(/*namespace, [type], config*/){
        var args = [].slice.call(arguments),
            path;

        if(args.length === 2) args.splice(1,0,undefined);
        path = this.getNamespace(args[0], args[1]);

        try{
            // Loop deep into App object with namespace array
            return (function deep(app, i){
                return path[i+1] ? deep(app[path[i]], ++i) : app[path[i]];
            })(this, 0);
        } catch(e) {
            console.log('No objects at '+path.join('/')+' exists');
        }
    },

    /**
     * This method designed for simple declaration objects in appropriative namespace of App.
     *
     * Accept three paramets in arguments object:
     *
     * {string} arguments[0] = namespace of object - Model/Sidebar;
     * {string} arguments[1] = type of object (optional) - Layout/[optional namespace]
     * {Object} arguments[2] = Object to set in current namespace
     *
     */
    set: function(/*namespace, [type], object*/){
        var args = [].slice.call(arguments),
            path, lvl;
        if(args.length === 2) args.splice(1,0,undefined);
        path = this.getNamespace(args[0], args[1]);

        return (function deep(app, i){
            lvl = path[i];
            // If current namespace lvl is not the last...
            return path[i+1] ?
                // Go deeper if already exists...   Or create new namespace
                (app[lvl] ? deep(app[lvl], ++i) : deep( (app[lvl] = {}), ++i) ) :
                //Last level, and it is already exists...   Create new object in namespace
                (app[lvl] ? 'Object is already created.' : ( app[lvl] = args[2] ) );
        })(this, 0);
    },


    /**
     *
     * @param {string} namespace
     * @param {string} [type]
     * @returns {Array} - namespace of requested object in App
     */
    getNamespace: function(namespace, type) {
        var path = namespace.split('/'), i, l;

        console.log(type);
        if(type){
            // Check if type is a multilevel namespace
            type.search('/') !== 1 ?
                path.splice(1, 0, type) :
                path.splice(1, 0, this.getNamespace(type));
        }

        // Add 's' to all namespase element, except the last one,
        // so we can use 'model', 'view' in singular form.
        for(i = 0, l = path.length; i < l-1; i++){
            path[i] = path[i].replace(/([^s])$/, "$1s");
        }

        // Convers all first letters to uppercase
        path = _.map(path, function (letters) {
            return letters[0].toUpperCase() + letters.slice(1);
        });

        return path;
    }
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
App.set('model/BaseForm', 'form', Backbone.Model.extend({

}));
App.set('model/Login', 'form', App.Models.Forms.BaseForm.extend({
    defaults: {
        login: '',
        password: ''
    },

    validate: function(attributes){
        console.log(attributes);
    },

    login: function(data){
        this.set(data);

        if (!this.isValid()) {
            console.log(this.validationError);
        }
    }
}));
App.set('model/Recover', 'form', App.Models.Forms.BaseForm.extend({
    defaults: {
        email: ''
    },

    validate: function(attributes){

    },

    recover: function(){

    }

}));
App.set('model/Search', 'form', Backbone.Model.extend({
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
}));
App.set('model/Signin', 'form', App.Models.Forms.BaseForm.extend({
    defaults: {
        login: '',
        email: '',
        password: '',
        password2: ''
    },

    validate: function(attributes){

    },

    signin: function(){

    }
}));
/**
 * Cart model
 */
App.set('model/Cart', 'content', Backbone.Model.extend({
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

}));
App.set('model/Main', 'layout', Backbone.Model.extend({
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
}));
App.set('collection/Carts', Backbone.Collection.extend({
    url: 'assets/js/database/carts.json',
    model: App.Models.Cart
}));
// BaseView for views with subviews.
// Extended with helpful methods for rendering DOM
App.set('view/BaseView', Backbone.View.extend({

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
}));
/**
 * This object implemets useful methods for validating form inputs
 * (c) 2016 Nikita Slobodian
 */

App.set('view/BaseForm', 'form', Backbone.View.extend({
    // Validation events
    events: {
        'submit form': 'submitForm',
        'blur input[name]': 'validateInput'
    },

    // Validation on submitting form event handler
    // Submittion of this form should be implemented in successor object
    // If no errors occures on validation, fires submit method.
    submitForm: function(e){
        e.preventDefault();
        var $form = $(e.target),
            $inputs = $form.find(':input[name]'),
            noErrors = true;

        // Loop over form inputs and return general form validation flag.
        // On every iteration check current input to set/remove error messages
        // Reduce general form error status. If error flag is already set, continue
        // inputs validation and return same flag. If there are still to errors, try
        // to set them from current input validation.
        noErrors = _.reduce($inputs, function(flag, item){
            var result = this.validateOne(item);
            return flag === true ? result : flag;
        }, noErrors, this);

        if(noErrors && this['submit']){
            // Submitting method fires in successor object
            this['submit'].call(this, e);
        }
    },

    // Validation of one current input
    validateInput: function(e){
        return this.validateOne(e.target);
    },

    /**
     *
     * @param {Object} target - DOM object
     * @returns {boolean}
     */
    validateOne: function(target){
        var $target = $(target),
            value = $target.val().trim(),
            rules = $target.data('validate') || {},
            isValid, error;
        rules.type = $target.attr('type') || 'text';
        rules.required = !!$target.attr('required');

        // If current target type is number, than max and min validators behavior is different.
        // Validators should compare number value, not number string length.
        if( rules.type === 'number' && ($.isNumeric(rules.min) || $.isNumeric(rules.max))){
            rules.numMin = rules.min;
            rules.numMax = rules.max;

            // Set undefined value to skip them in validating loop
            rules.min = rules.max = undefined;
        }

        // If input value satisfied every validating rule, return true
        isValid = _.every(rules, function(rule, validator){
            if(rule !== 0 && !!rule){
                // If curret validator is 'type', check validation functions by value: 'email', 'number'
                if(validator === 'type') validator = rule;

                // If function return something, this is fail
                if(this.validators[validator])
                    error = this.validators[validator].call(this, rule, value);

            }
            return !error;
        }, this);

        this.toggleError($target, error);
        return isValid;
    },

    // Validating functions should not return enything if input is correct.
    // If validation fail, return error message.
    // Every validator accept input value and rule that input should match
    validators: {
        min: function(rule, value){
            if( !(value.length >= rule) )
                return 'Value length must be greater than '+rule+' symbols.'
        },
        max: function(rule, value){
            if( !(value.length <= rule) )
                return 'Value length must be less than '+rule+' symbols.';
        },
        numMin: function(rule, value){
            if( !(value >= rule) )
                return 'Number must be greater than '+rule+'.';
        },
        numMax: function(rule, value){
            if( !(value <= rule) )
                return 'Number must be less than '+rule+'.';
        },
        required: function(rule, value){
            if( !(value.length !== 0) )
                return 'Field value is required';
        },
        email: function(rule, value){
            var pattern = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
            ///^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
            if( !(pattern.test(value)) )
                return 'Incorrect email format';
        },
        number: function(rule, value){
            // In some reason, underscore _.isNumber() not working...
            if( !($.isNumeric(value)) )
                return 'Field value must be numeric';
        },
        equals: function(rule, value){
            var $twink = $(rule),
                name = $twink.attr('placeholder') || $("label[for='"+$twink.attr('id')+'"]').html();
            if( !($twink.val() === value) )
                return 'Field value must match '+name;
        }
    },

    /**
     *
     * @param {Object} $target - jQuery DOM object
     * @param {(undefined|string)} error
     */
    toggleError: function($target, error){
        var $helpBlock = $target.next(),
            $container = $target.closest('.form-group'),
            $template = error ? $('<span class="help-block">'+error+'</span>') : '';

        if(error){
            $container.addClass('has-error').removeClass('has-success');
            $helpBlock.length !== 0 ?
                $helpBlock.replaceWith($template) :
                $target.after($template);
        } else {
            $container.addClass('has-success').removeClass('has-error');
            if($helpBlock) $helpBlock.remove();
        }
    }
}));
App.set('view/Contact', 'form', App.Views.Forms.BaseForm.extend({
    initialize: function(){

    },
    template: App.Helpers.getTemplate('#contactForm'),
    successMessage: App.Helpers.getTemplate('#contactFormSuccess'),
    errorMessage: App.Helpers.getTemplate('#contactFormError'),

    render: function(){
        //this.$el.html( this.template() );
        //return this;
    },
    submit: function(){
        console.log('Contact form is submitting');
    }
}));
App.set('view/Login', 'form', App.Views.Forms.BaseForm.extend({
    initialize: function(){},
    template: App.Helpers.getTemplate('#loginForm'),
    render: function(){
        this.setElement( this.template() );
        return this;
    }
}));
App.set('view/Recover', 'form', App.Views.Forms.BaseForm.extend({
    initialize: function(){},
    template: App.Helpers.getTemplate('#recoverForm'),
    render: function(){
        this.setElement( this.template() );
        return this;
    }
}));
App.set('view/Search', 'form', Backbone.View.extend({
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
}));
App.set('view/Sigin', 'form', App.Views.Forms.BaseForm.extend({
    initialize: function(){},
    template: App.Helpers.getTemplate('#signinForm'),
    render: function(){
        this.setElement( this.template() );
        return this;
    },
    submit: function(e){
        console.log('Form is submitting');
    }
}));
// Cart toolbox view

App.set('view/CartToolbox', 'content', App.Views.BaseView.extend({

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
}));


App.set('view/Cart', 'content', App.Views.BaseView.extend({
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

}));


App.set('view/Carts', 'layout', Backbone.View.extend({
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


    redraw: function(){
        this.reset().render();
    },

    reset: function(){
        this.$el.html('');
        return this;
    },

    addOne: function(model){
        var view = new App.Views.Cart({model: model});
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


App.set('view/Contacts', 'layout', App.Views.BaseView.extend({

}));
// Navigation menu

App.set('view/Topmenu', 'layout', App.Views.BaseView.extend({
    template: App.Helpers.getTemplate('#topMenu'),
    render: function(){
        this.$el.html( this.template() );
        return this;
    }
}));

console.log(App.set('view/Topmenu', {'name': 'value'}));


// Sidebar layout

App.set('view/Sidebar', 'layout', App.Views.BaseView.extend({
    initialize: function(){
        this.model.on('change:sidebarCollapsed', this.toggleSidebar, this);
        this.subviews['.searchform'] = App.createForm('view/Search', {model: App.createForm('model/Search')});
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
}));



// Content layout
// This layout includes top navigation menu, dynamic content wrapper and footer

App.set('view/MainContent', 'layout', App.Views.BaseView.extend({
    initialize: function(){
        this.subviews['.topmenu'] = App.createLayout('view/Topmenu');// new App.Views.Layout.Topmenu()
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
}));


// Main wrapper

App.set('view/Wapper', 'layout',  App.Views.BaseView.extend({

    el: '#wrapper',

    initialize: function(){
        this.listenTo(App.Vent, 'layoutRender', this.render);
        this.model.on('change:sidebarCollapsed', this.toggleSidebar, this);
    },


    initSubviews: function(){
        this.subviews = [];
        if(this.model.withSidebar()){
            this.$el.addClass('with-sidebar');
            this.subviews.push( App.createLayout('view/Sidebar', {model: this.model}) );

            console.log(this.subviews);

            if(this.model.sidebarCollapsed())
                this.$el.addClass('sidebar-collapsed');
        }
        this.subviews.push( App.createLayout('view/MainContent', {model: this.model}) );
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

}));
App.Router = Backbone.Router.extend({
    routes: {
        '': 'index',
        '!/': 'index',
        '!/account/signin': 'signin',
        '!/account/login': 'login',
        '!/account/logout': 'logout',
        '!/account/recover': 'recover',
        '!/contacts': 'contacts',
        //'!/page-:id': 'page',
        //'!/category-:id': 'category',
        //'!/add-media': 'addMedia'
    },

    index: function(){
        App.Vent.trigger('layoutUpdate');
        var collection = new App.Collections.Carts,
            view = App.create('view/Carts');
        collection.fetch({
            success: success,
            error: error
        });

        function success(){
            App.Vent.trigger('collectionLoad', collection);
            App.Helpers.renderContent(view.render().el);
        }
        function error(collection, response){
            console.log(response.responseText);
            //MyApp.vent.trigger("search:error", response);
        }
    },

    login: function(){
        App.Vent.trigger('layoutUpdateForce', {sidebar: false});
        var model = App.createForm('model/Login'),
            view  = App.createForm('view/Login', {model: model});

        App.Helpers.renderContent(view.render().el);
    },

    logout: function(){
        //delete session and navigate to index
        this.navigate('', {trigger: true, replace: true});
    },

    signin: function(){
        App.Vent.trigger('layoutUpdateForce', {sidebar: false});
        var model = App.createForm('model/Sigin'),
            view  = App.createForm('view/Sigin', {model: model});


        App.Helpers.renderContent(view.render().el);
    },

    recover: function(){
        App.Vent.trigger('layoutUpdateForce', {sidebar: false});
        var model = App.createForm('model/Recover'),
            view  = App.createForm('view/Recover', {model: model});


        App.Helpers.renderContent(view.render().el);
    },

    addMedia: function(){

    },

    contacts: function(){
        App.Vent.trigger('layoutUpdateForce', {sidebar: false});
        var model = App.createForm('model/Contacts'),
            view  = App.createForm('view/Contacts', {model: model});


        App.Helpers.renderContent(view.render().el);
    }

});
App.create('view/Wrapper', 'layout', {
    model: App.create('model/Main', 'layout')
});

new App.Router;
Backbone.history.start();
