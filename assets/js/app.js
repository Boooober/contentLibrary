'use strict';
var App = {
    debug: true,

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
    //State: {},
    Vent: {},
    Helpers: {},


    /**
     * Methods below are shortcuts for App namespase structure
     * @param namespace - string which contains type/name of object. Example: Model/Sidebar
     * @param {Object} config - attributes/properties that will be set to new object instance
     * @returns {(Object|undefined)}
     */
    createForm: function(namespace, config){
        return this.create(namespace, 'form', config)
    },
    createLayout: function(namespace, config){
        return this.create(namespace, 'layout', config)
    },
    createContent: function(namespace, config){
        return this.create(namespace, 'content', config)
    },


    /**
     * Methods below are shortcuts for working with App state parametrs:
     * layout, queried collection, user object
     */
    getLayout: function(){
        return this.getStateParam('layout');
    },
    getQuery: function(){
        return this.getStateParam('query');
    },
    setQuery: function(query){
        this.setStateParam('query', query);
    },
    getUser: function(){
        var user = true;
        //return this.getStateParam('user');
        return user;
    },
    getRouter: function(){
        return this.getStateParam('router');
    },

    getStateParam: function(param){
        return this.get('state').get(param);
    },
    setStateParam: function(param, value){
        return this.get('state').set(param, value);
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
        var args = [].slice.call(arguments), object;

        // argument[1] is optional, so splice if it`s empty;
        if(args.length === 2 && _.isObject(args[1])) args.splice(1,0,undefined);

        object = this.get.apply(this, args);
        if(object){

            if(App.debug) console.log('New instance of '+this.getNamespace(args[0], args[1]).join('/')+' successfully created');

            return new object(args[2]);
        }
        if(App.debug) console.log('No objects found at '+this.getNamespace(args[0], args[1]).join('/')+'.');
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
    get: function(/*namespace, [type]*/){
        var args = [].slice.call(arguments),
            path, obj;

        //if(args.length === 2) args.splice(1,0,undefined);
        path = this.getNamespace(args[0], args[1]);

        try{
            obj = (function deep(app, i){
                return path[i+1] ? deep(app[path[i]], ++i) : app[path[i]];
            })(this, 0);
            if(obj) return obj;
            if(App.debug) console.log('Path is correct, but object is missing... '+path.join('/'));
        } catch(e) {
            if(App.debug) console.log('No objects at '+path.join('/')+' exists');
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

        // argument[1] is optional, so splice if it`s empty;
        if(args.length === 2 && _.isObject(args[1])) args.splice(1,0,undefined);
        path = this.getNamespace(args[0], args[1]);

        return (function deep(app, i){
            lvl = path[i];
            // If current namespace lvl is not the last...
            return path[i+1] ?
                // Go deeper if already exists...   Or create new namespace
                (app[lvl] ? deep(app[lvl], ++i) : deep( (app[lvl] = {}), ++i) ) :
                //Last level, and it is already exists...   Create new object in namespace
                (app[lvl] ? 'Object is already exists.' : ( app[lvl] = args[2] ) );
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
 *** layoutUpdate: fire this event to change page layout options.
 *   For example, to hide sidebar from display and save this option to localStorage.
 *
 *** layoutRender: initial render of base layout.
 *   Layout options can be changed with layoutUpdate.
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
        $('.main-content').html(content);
    },
    getTemplate: function(selector){
        return _.template($(selector).html());
    },

    //getTypeTemplate: function(type){
    //    return this.getTemplate('#'+type+'Cart');
    //},
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
App.set('model/Contact', 'form', App.get('model/BaseForm', 'form').extend({
    defaults: {
        name: '',
        email: '',
        message: ''
    },

    // Response from server
    response: '',

    send: function(){
        // Ajax sending to the server...
        console.log('Sending to server... Fake timeout 2s.', this.toJSON());

        // Do fake server response
        setTimeout(_.bind(function(){
            if(this.get('message') === 'error'){
                this.response = 'Some error occures while sending your message. Please, try again later';
                this.set('success', false);
            } else{
                this.response = 'Your message was successfully sent. We will contact you shortly';
                this.set('success', true);
            }
        }, this), 2000);

    }
}));
App.set('model/Login', 'form', App.get('model/BaseForm', 'form').extend({
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
App.set('model/Recover', 'form', App.get('model/BaseForm', 'form').extend({
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
        var collection = App.create('collection/Carts');
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
App.set('model/Signin', 'form', App.get('model/BaseForm', 'form').extend({
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
    },

}));
App.set('model/Main', 'layout', Backbone.Model.extend({

    // Save layout options in storage
    storage: App.Helpers.storage('Layout'),

    // Initialize layout on application start
    initialize: function(){
        this.set( _.defaults(this.loadOptions(), this.getOptions()) );
        this.listenTo(App.Vent, 'layoutChange', this.change);
    },

    // Store this options separate from attributes
    defaultOptions: {
        withSidebar: false,
        sidebarCollapsed: true
    },

    loadOptions: function(){
        this.set( this.storage.get() );
    },

    getOptions: function(){
        var options = _.extend({}, this.defaultOptions);

        // Show sidebar only for authorized users
        if(App.getUser()) options.withSidebar = true;
        return options;
    },

    // Change layout
    change: function(options){
        options = options || this.loadOptions();
        this.set(options);
    },

    // Change layout and save to storage
    // Used only from inner methods
    update: function(options){
        this.change(options);
        this.storage.set(this.toJSON());
    },

    //Functions predicates
    withSidebar: function(){
        return this.get('withSidebar');
    },
    sidebarCollapsed: function(){
        return this.get('sidebarCollapsed');
    },

    //Trigger function
    toggleSidebar: function(){
        this.update({sidebarCollapsed: !this.get('sidebarCollapsed')});
        //this.set('sidebarCollapsed', );

        //After end of css toggle animation
        setTimeout(function(){
            App.Vent.trigger('layoutResize');
        }, 400);
    }
}));
App.set('model/GoogleMap', 'widget', Backbone.Model.extend({
    defaults: {
        lat: 50.432014,
        lng: 30.486093,
        zoom: 18,
        scrollwheel: false,
        styles: [{"featureType":"water","elementType":"geometry","stylers":[{"color":"#e9e9e9"},{"lightness":17}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#ffffff"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":16}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":21}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#dedede"},{"lightness":21}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"lightness":16}]},{"elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#333333"},{"lightness":40}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#f2f2f2"},{"lightness":19}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#fefefe"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#fefefe"},{"lightness":17},{"weight":1.2}]}],
        markers: [
            {
                lat: 50.432014,
                lng: 30.486093,
                title: 'Epam office!'
            }
        ]
    }
}));
App.set('collection/Carts', Backbone.Collection.extend({
    url: 'assets/js/database/carts.json',
    model: App.get('model/Cart', 'content')
}));
// BaseView for views with subviews.
// Extended with helpful methods for rendering DOM
App.set('view/BaseView', Backbone.View.extend({

    // https://ianstormtaylor.com/assigning-backbone-subviews-made-even-cleaner
    // https://ianstormtaylor.com/rendering-views-in-backbonejs-isnt-always-simple
    // Render subviews with delegating events;
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
    },

    // Idea from http://mikeygee.com/blog/backbone.html
    // Remove all subviews after closing current
    remove: function(){
        if( this.subviews ){
            _.each(this.subviews, function(subview){
                subview.remove();
            });
        }
        Backbone.View.prototype.remove.call(this);
    }
}));
/**
 * This object implemets useful methods for validating form inputs
 * (c) 2016 Nikita Slobodian
 */

App.set('view/Validator', 'form', Backbone.View.extend({
    // Validation events
    events: {
        'submit form': 'submitForm',
        'blur input[name]': 'validateHandler'
    },

    // Validation on submitting form event handler
    // Submittion of this form should be implemented in successor object
    // If no errors occures on validation, fires submit method.
    submitForm: function(e){
        e.preventDefault();
        var $form = $(e.target),
            noErrors = true,
            data = this.processData($form.find(':input[name]'));


        // Loop over form inputs and return general form validation flag.
        //
        // On every iteration check current input to set/remove error messages
        // Reduce general form error status. If error flag is already set, continue
        // inputs validation and return same flag. If there are still to errors, try
        // to set them from current input validation.
        noErrors = _.reduce(data, function(flag, item){
            var result = this.validateOne(item);
            return flag === true ? result : flag;
        }, noErrors, this);

        if(noErrors && this['submit']){
            // Submitting method fires in successor object
            this['submit'].call(this, e, data);
        }
    },


    /**
     *
     * Process inputs data.
     * @param {Array} inputs
     * @returns {Object} indexed by input name attribute with values {{$target: Object, value: string}}
     */
    processData: function(inputs){
        var data = {}, obj, $input;
        _.each(inputs, function(input){
            $input = $(input);
            obj = {
                $target: $input,
                value: $input.val().trim()
            };
            data[$input.attr('name')] = obj;
        });
        return data;
    },

    // Validate one currently blured input
    validateHandler: function(e){
        var data = this.processData($(e.target));
        _.each(data, this.validateOne, this);
    },

    /**
     * Validate one input
     * @param {{$target: Object, value: string}} data
     * @returns {boolean|*}
     */
    validateOne: function(data){
        var $target = data.$target,
            value = data.value,
            rules = $target.data('validate') || {},
            isValid, error;
        rules.type = $target.attr('type') || 'text';
        rules.required = !!$target.attr('required');
        rules.pattern = $target.attr('pattern');

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
        },
        pattern: function(rule, value){
            if( !(new RegExp(rule).test(value)) )
                return 'Field value malformed';
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
App.set('view/BaseForm', 'form', App.get('view/Validator', 'form').extend({

    // Clear all inputs values
    clearInputs: function(){
        this.$(':input[name]').each(function(){
            $(this).val('');
        });
    }
}));
App.set('view/Contact', 'form', App.get('view/BaseForm', 'form').extend({
    initialize: function(){
        this.model = App.createForm('model/Contact');
        this.listenTo(this.model, 'change:success', this.showResponse);
    },
    template: App.Helpers.getTemplate('#contactForm'),

    render: function(){
        this.$el.html( this.template() );
        return this;
    },
    submit: function(e, data){
        this.model.set(_.reduce(data, function(attrs, input, name){
            attrs[name] = input.value;
            return attrs;
        }, {}));
        this.model.send();
    },
    showResponse: function(){
        App.create('view/Popup', 'widget').render(this.model.response, {toggle: false, trigger: false});
        if(this.model.get('success')) this.clearInputs();
        this.model.clear({silent: true});
    }
}));
App.set('view/Login', 'form', App.get('view/BaseForm', 'form').extend({
    initialize: function(){},
    template: App.Helpers.getTemplate('#loginForm'),
    render: function(){
        this.setElement( this.template() );
        return this;
    }
}));
App.set('view/Recover', 'form', App.get('view/BaseForm', 'form').extend({
    initialize: function(){},
    template: App.Helpers.getTemplate('#recoverForm'),
    render: function(){
        this.setElement( this.template() );
        return this;
    }
}));
App.set('view/Search', 'form', Backbone.View.extend({
    initialize: function(){
        this.model = App.createForm('model/Search');
    },
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
App.set('view/Sigin', 'form', App.get('view/BaseForm', 'form').extend({
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
App.set('view/BaseCart', 'content', App.get('view/BaseView').extend({
    scaleMedia: function () {
        var video = this.$('.video-cart iframe'),
            container = video.parent();
        var scaleMedia = function () {
            var ratio = container.width() / video.attr('width'),
                height = video.attr('height') * ratio;

            container.css('padding-bottom', height);
        }.bind(this);

        setTimeout(scaleMedia, 0);
        $(window).resize(scaleMedia);
        this.listenTo(App.Vent, 'layoutResize', scaleMedia);
    },

    processMediaTag: function(link, title){
        var wrap = $('<div />');

        // Create DOM element and push it to temp wrapper
        if( this.model.isVideo() ){
            wrap.append($('<iframe />').attr({
                width: 640,
                height: 360,
                src: link,
                frameborder: 0,
                allowfullscreen: true
            }));
        } else if(this.model.isImage() ){
            wrap.append($('<img />').attr({
                src: link,
                alt: title,
                title: title
            }));
        }

        // Return text representation of DOM element
        // To use it in template
        return wrap.html();
    },

    // Return type of cart
    typeClass: function(){
        return this.model.isImage() ? 'image-cart' :
            this.model.isVideo() ? 'video-cart' :
            'text-type';
    }


}));


// Cart toolbox view

App.set('view/CartToolbox', 'content', App.get('view/BaseView').extend({

    initialize: function() {
        this.model.on('change:favorites', this.render, this);
    },
    events: {
        'click .rate-button': 'toggleRate',
        'click .post-link': 'openInPopup'
    },
    template: App.Helpers.getTemplate('#cartToolbox'),

    render: function(){
        this.$el.html( this.template( this.model.toJSON() ) );
        return this;
    },

    toggleRate: function(e){
        e.preventDefault();
        this.model.favoriteToggle();
    },

    openInPopup: function(e){
        e.preventDefault();
        var id = this.model.get('id'),
            router = App.getRouter(),
            content = App.createContent('view/CartInPopup', {model: this.model});

        router.navigate('!/page/' + id);

        App.create('view/Popup', 'widget')
            .render(content, {

                // Redirect to index after close popup
                redirect: function () {
                    router.navigate('');
                }
            });
    }
}));


App.set('view/Cart', 'content', App.get('view/BaseCart', 'content').extend({
    initSubviews: function(){
        this.subviews = {};
        this.subviews['.toolbox'] = App.createContent('view/CartToolbox', {model: this.model});
        return this.subviews;
    },

    mediaTemplate: App.Helpers.getTemplate('#mediaCart'),
    textTemplate: App.Helpers.getTemplate('#textCart'),

    render: function(){
        var type = this.model.isText() ? 'text' : 'media',
            template = this[type+'Template'](this.model.toJSON());

        this.setElement(template);
        this.assign( this.initSubviews() );

        if(this.model.isVideo()) this.scaleMedia();

        return this;
    }
}));


App.set('view/CartInPopup', 'content', App.get('view/BaseCart', 'content').extend({
    template: App.Helpers.getTemplate('#cartInPopup'),
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        if(this.model.isVideo()) this.scaleMedia();
        return this;
    }
}));



App.set('view/Page', 'content', App.get('view/BaseView').extend({
    //template: App.Helpers.template('#pageContent'),
    initialize: function(options){
        this.model = App.Query.get( options.id );
    },
    render: function(){
        var model = this.model.toJSON();
        this.setElement( this.template(this.model.toJSON()) );
        return this;
    }
}));
App.set('view/UserRates', 'content', App.get('view/BaseView').extend({
    initialize: function(){
        this.model = App.User.get();
    },
    template: App.Helpers.getTemplate('#userRates'),
    render: function(){
        this.$el.html( this.template() );
        return this;
    }
}));
App.set('view/UserProfile', 'content', App.get('view/BaseView').extend({
    initialize: function(){
        this.model = App.User.get();
    },
    template: App.Helpers.getTemplate('#userProfile'),
    render: function(){
        this.$el.html( this.template() );
        return this;
    }
}));
App.set('view/Account', 'layout', App.get('view/BaseView').extend({
    template: App.Helpers.getTemplate('#account'),
    initSubviews: function(){
        this.subview = {
            '.user-profile': App.create('view/UserProfile', 'content'),
            '.user-rates': App.create('view/UserRates', 'content')
        };
        return this.subview;
    },
    render: function(){
        this.setElement( this.template() );
        this.assign( this.initSubviews() );
        App.Helpers.renderContent(this.el);
        return this;
    }
}));
App.set('view/Carts', 'layout', App.get('view/BaseView').extend({
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
        App.Helpers.renderContent( this.$el.wrap('<div class="container-fluid" />').parent() );
        this.masonry();
        return this;
    },

    // Render every subview and save pointers to objects
    addOne: function(model, index){
        var view = App.create('view/Cart', 'content', {model: model});

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


App.set('view/Contacts', 'layout', App.get('view/BaseView').extend({
    template: App.Helpers.getTemplate('#contactPage'),
    initSubviews: function(){
        this.subviews = {
            '.contact-form': App.createForm('view/Contact', App.createForm('model/Contact')),
            '.google-map': App.create('view/GoogleMap', 'widget')
        };
        return this.subviews;
    },
    render: function(){
        this.setElement( this.template() );
        this.assign( this.initSubviews() );
        App.Helpers.renderContent(this.el);
        return this;
    }
}));
// Navigation menu

App.set('view/Topmenu', 'layout', App.Views.BaseView.extend({

    template: App.Helpers.getTemplate('#topMenu'),

    initialize: function(){
        this.model = App.getLayout();
        this.model.on('change:withSidebar', this.render, this);
    },

    render: function(){
        this.$el.html( this.template( this.model.toJSON() ) );
        this.assign( this.initSubviews() );
        return this;
    },

    initSubviews: function(){
        this.subviews = {};
        this.subviews['.searchform'] = App.createForm('view/Search');
        return this.subviews;
    }
}));

// Sidebar layout

App.set('view/Sidebar', 'layout', App.Views.BaseView.extend({

    template: App.Helpers.getTemplate('#sidebarLayout'),

    initialize: function(){
        this.model = App.getLayout();
        this.model.on('change:sidebarCollapsed', this.toggleSidebar, this);

        // Remove if withSidebar changed (it will always change to false)
        this.model.on('change:withSidebar', this.remove, this);
    },

    render: function(){
        this.setElement( this.template() );
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

    events: {
        'click .sidebar-toggle': 'toggleSidebar'
    },

    template: App.Helpers.getTemplate('#pageLayout'),

    initialize: function(){
        this.model = App.getLayout();
    },

    render: function () {
        this.setElement(this.template());
        this.assign(this.initSubviews());
        return this;
    },
    initSubviews: function(){
        this.subviews = {};
        this.subviews['.topmenu'] = App.createLayout('view/Topmenu');
        return this.subviews;
    },
    toggleSidebar: function(){
        this.model.toggleSidebar();
    }
}));


// Main wrapper

App.set('view/Wrapper', 'layout',  App.get('view/BaseView').extend({
    el: '#wrapper',

    template: App.Helpers.getTemplate('#wrapperAppends'),

    initialize: function(){
        this.model = App.getLayout();

        this.listenTo(App.Vent, 'layoutRender', this.render);

        this.model.on('change:withSidebar', this.render, this);
        this.model.on('change:sidebarCollapsed', this.toggleSidebar, this);
    },

    render: function(){
        this.$el.html('').removeClass();
        this.initSubviews();

        _.each(this.subviews, function(subview){
            this.$el.append(subview.render().el);
        }, this);
        this.$el.append( this.template() );
    },

    initSubviews: function(){
        this.subviews = [];

        if(this.model.withSidebar()){
            this.$el.addClass('with-sidebar');
            this.subviews.push( App.createLayout('view/Sidebar') );

            if(this.model.sidebarCollapsed())
                this.$el.addClass('sidebar-collapsed');
        }
        this.subviews.push( App.createLayout('view/MainContent') );
    },

    // Resize layouts width
    toggleSidebar: function(){
        this.$el.toggleClass('sidebar-collapsed');
    }

}));
// Google map styled by Snazzy Maps
App.set('view/GoogleMap', 'widget', Backbone.View.extend({

    initialize: function(){
        this.model = App.create('model/GoogleMap', 'widget');
    },
    apiKey: '',

    render: function(){
        (!window.google || !(window.google && window.google.maps)) ?
            $.getScript('//maps.googleapis.com/maps/api/js?key='+this.apiKey, _.bind(this.renderMap, this)) :
            this.renderMap();
    },

    renderMap: function(){
        var options,
            LatLng = new google.maps.LatLng(this.model.get('lat'), this.model.get('lng'));

        options = {
            center: LatLng,
            zoom: this.model.get('zoom'),
            styles: this.model.get('styles'),
            scrollwheel: this.model.get('scrollwheel')
        };

        if(!this.map){
            this.map = new google.maps.Map(this.el, options);

            _.each(this.model.get('markers'), function(marker){
                new google.maps.Marker({
                    position: new google.maps.LatLng(marker.lat, marker.lng),
                    map: this.map,
                    title: marker.title
                });
            }, this);
        }
    }
}));


/**
 * Popup widget
 */

App.set('view/Popup', 'widget', Backbone.View.extend({

    className: 'popup',
    initialize: function(){
        this.root = $(document).find('.popup-container');

        this.$content = $('<div class="popup-content" />');

        // Create popup structure
        // .popup -> .popup-container -> .popup-box -> content...
        this.$el.html( $('<div class="popup-wrapper" />').html(this.$content) );
    },
    events: {
        'click': 'closeHandler',
        'click .close-trigger': 'closeHandler'
    },
    // Classes of popup size
    sizes: {
        sm: 'popup-sm',
        md: 'popup-md'
    },
    defaultOptions: {
        // Toggle popup automatically
        toggle: false,
        // Delay for toggle option
        toggleDelay: 4000,
        // Display or not close trigger
        trigger: true,
        // Popup size
        size: 'md',
        // Additional class names to the popup wrapper
        className: 'popup-bg-default',
        // Additional css options for wrapper
        css: {},
        removeTimeout: 500,
        // Redirect callack after popup close
        redirect: function(){}
    },

    render: function(data, options){
        var content = this.getDataContent(data);

        this.$el.css('z-index', 9999);
        this.$content.html(content);
        this.setOptions(options);
        this.open();
    },

    setOptions: function(options){
        options = _.defaults(options || {}, this.defaultOptions);

        // Loop through options object to set their values
        _.each(options, function(value, option){
            switch (option){
                case 'toggle':
                    // Set timeout to close popup
                    if (value === true){
                        if(App.debug) console.log('popup will close in '+options.toggleDelay+' ms');

                        //Set timeout identifier to data attribute to remove it in case closing before toggleDelay
                        this.$el.data('timeout', setTimeout(_.bind(this.close, this), options.toggleDelay));
                    }
                    break;
                case 'trigger':
                    if(value === true)
                        this.$content.append('<div class="close-trigger" />');
                    break;
                case 'size':
                    this.$el.addClass(this.sizes[value]);
                    break;
                case 'className':
                    this.$el.addClass(value);
                    break;
                case 'css':
                    this.$el.css(value);
                    break;
                default:
                    this[option] = value;
                    break;
            }
        }, this);
    },

    closeHandler: function(e){
        if(e.target !== e.currentTarget) return;
        this.close();
    },

    open: function(){
        this.root.append(this.$el);
        this.$el.fadeIn().addClass('open--popup');
    },
    close: function(){
        var timeout = this.$el.data('timeout');
        if( timeout !== void(0) ) clearTimeout(timeout);

        this.$el.toggleClass('open--popup close--popup');
        setTimeout(_.bind(this.removePopup, this), this.removeTimeout);
    },
    removePopup: function(){
        this.$el.remove();
        this.removeContentModel();
        this.redirect();
        this.remove();
    },

    // Methods are allow to work not only with plain text content,
    // but also with Backbone Views.

    getDataContent: function(data){
        if( data instanceof Backbone.View){
            this.contentModel = data;
            return data.render().el;
        }
        return data;
    },
    removeContentModel: function(){
        if(this.contentModel) this.contentModel.remove();
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
        //'!/account': 'account',
        //'!/page/:id': 'page'
        //'!/category-:id': 'category',
        //'!/add-media': 'addMedia'
    },

    execute: function (callback, args, name) {
        var overflowViews = ['page'];

        // If this is not overflow layout  and view isset
        if ($.inArray(name, overflowViews) === -1 && this.view){
            // Remove current view and all subviews;
            this.view.remove();
            this.view = void(0);
        }

        // Call new route to render view
        if (callback) callback.apply(this, args);
    },

    index: function(){
        App.Vent.trigger('layoutChange');

        var collection = App.create('collection/Carts'),
            view = this.view = App.createLayout('view/Carts');


        collection.fetch({
            success: success,
            error: error
        });

        function success(collection){
            App.Vent.trigger('collectionLoad', collection);
            App.setQuery(collection);
        }
        function error(collection, response){
            console.log(response.responseText);
            //MyApp.vent.trigger("search:error", response);
        }
    },


    // Forms
    // ==============
    login: function(){
        App.Vent.trigger('layoutChange', {sidebarCollapsed: true});
        this.view = App.createForm('view/Login', {model: App.createForm('model/Login')});

        App.Helpers.renderContent(this.view.render().el);
    },

    logout: function(){
        //delete session and navigate to index
        this.navigate('', {trigger: true, replace: true});
    },

    signin: function(){
        App.Vent.trigger('layoutChange', {sidebarCollapsed: true});
        this.view = App.createForm('view/Sigin', {model: App.createForm('model/Sigin')});

        App.Helpers.renderContent(this.view.render().el);
    },

    recover: function(){
        App.Vent.trigger('layoutChange', {sidebarCollapsed: true});
        this.view = App.createForm('view/Recover', {model: App.createForm('model/Recover')});

        App.Helpers.renderContent(this.view.render().el);
    },
    // ==============


    //Pages
    // ==============
    contacts: function(){
        App.Vent.trigger('layoutChange', {sidebarCollapsed: true});
        this.view = App.createLayout('view/Contacts').render();
    },

    //account: function(){
    //    App.Vent.trigger('layoutChange', {sidebarCollapsed: true});
    //    this.view = App.createLayout('view/Account').render();
    //},



    //page: function(id){
    //    var redirect = function(){
    //        return App.getRouter().navigate('', {trigger: true, replace: true});
    //    };
    //
    //    App.create('view/Popup', 'widget').render('sdfasdfsdf', {redirect: redirect});
    //
    //    console.log(id);
    //
    //
    //
    //
    //},

    addMedia: function(){

    }
    // ==============
});
App.State = new (Backbone.Model.extend({
    defaults: {
        user: {},
        router: {},
        layout: {},
        query: {}
    },

    initialize: function(){
        //fetch user
    },

    run: function(){
        // Create initial layout model and set as property to app state
        this.set('layout', App.create('model/Main', 'layout'));
        
        // Create main layout view
        App.create('view/Wrapper', 'layout');
        App.Vent.trigger('layoutRender');

        // Run routers when application starts
        this.set('router', new App.Router);
        Backbone.history.start();

    }
}));
App.State.run();
+function ($) {
    'use strict';

    // DROPDOWN CLASS DEFINITION
    // =========================

    var backdrop = '.dropdown-backdrop';
    var toggle   = '[data-toggle="dropdown"]';
    var Dropdown = function (element) {
        $(element).on('click.bs.dropdown', this.toggle)
    };

    Dropdown.VERSION = '3.3.7';

    function getParent($this) {
        var selector = $this.attr('data-target');

        if (!selector) {
            selector = $this.attr('href');
            selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, ''); // strip for ie7
        }

        var $parent = selector && $(selector);

        return $parent && $parent.length ? $parent : $this.parent()
    }

    function clearMenus(e) {
        if (e && e.which === 3) return;
        $(backdrop).remove();
        $(toggle).each(function () {
            var $this         = $(this);
            var $parent       = getParent($this);
            var relatedTarget = { relatedTarget: this };

            if (!$parent.hasClass('open')) return;

            if (e && e.type == 'click' && /input|textarea/i.test(e.target.tagName) && $.contains($parent[0], e.target)) return;

            $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget));

            if (e.isDefaultPrevented()) return;

            $this.attr('aria-expanded', 'false');
            $parent.removeClass('open').trigger($.Event('hidden.bs.dropdown', relatedTarget))
        })
    }

    Dropdown.prototype.toggle = function (e) {
        var $this = $(this);

        if ($this.is('.disabled, :disabled')) return;

        var $parent  = getParent($this);
        var isActive = $parent.hasClass('open');

        clearMenus();

        if (!isActive) {
            if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
                // if mobile we use a backdrop because click events don't delegate
                $(document.createElement('div'))
                    .addClass('dropdown-backdrop')
                    .insertAfter($(this))
                    .on('click', clearMenus)
            }

            var relatedTarget = { relatedTarget: this };
            $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget));

            if (e.isDefaultPrevented()) return;

            $this
                .trigger('focus')
                .attr('aria-expanded', 'true');

            $parent
                .toggleClass('open')
                .trigger($.Event('shown.bs.dropdown', relatedTarget))
        }

        return false
    };

    Dropdown.prototype.keydown = function (e) {
        if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return;

        var $this = $(this);

        e.preventDefault();
        e.stopPropagation();

        if ($this.is('.disabled, :disabled')) return;

        var $parent  = getParent($this);
        var isActive = $parent.hasClass('open');

        if (!isActive && e.which != 27 || isActive && e.which == 27) {
            if (e.which == 27) $parent.find(toggle).trigger('focus');
            return $this.trigger('click')
        }

        var desc = ' li:not(.disabled):visible a';
        var $items = $parent.find('.dropdown-menu' + desc);

        if (!$items.length) return;

        var index = $items.index(e.target);

        if (e.which == 38 && index > 0)                 index--;         // up
        if (e.which == 40 && index < $items.length - 1) index++;         // down
        if (!~index)                                    index = 0;

        $items.eq(index).trigger('focus')
    };


    // DROPDOWN PLUGIN DEFINITION
    // ==========================

    function Plugin(option) {
        return this.each(function () {
            var $this = $(this);
            var data  = $this.data('bs.dropdown');

            if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)));
            if (typeof option == 'string') data[option].call($this)
        })
    }

    var old = $.fn.dropdown;

    $.fn.dropdown             = Plugin;
    $.fn.dropdown.Constructor = Dropdown;


    // DROPDOWN NO CONFLICT
    // ====================

    $.fn.dropdown.noConflict = function () {
        $.fn.dropdown = old;
        return this
    };

    // APPLY TO STANDARD DROPDOWN ELEMENTS
    // ===================================

    $(document)
        .on('click.bs.dropdown.data-api', clearMenus)
        .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
        .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
        .on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown)
        .on('keydown.bs.dropdown.data-api', '.dropdown-menu', Dropdown.prototype.keydown)

}(jQuery);
