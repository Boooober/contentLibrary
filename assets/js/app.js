'use strict';
var App = {
    debug: false,

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
     * Widgets
     */
    createWidget: function(name){
        return this.create('view/'+name, 'widget');
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
        return this.getStateParam('user');
    },
    setUser: function(user){
        this.setStateParam('user', user);
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
 * State events
 * ------------
 *
 *** initialized: Application initialized and ready to run
 *
 *
 *
 * Layout events
 * -------------
 *
 *** layoutResize: event fires when layout sizes changed.
 *   For example, sidebar toggle needs to reinit masonry and video scale.
 *
 *** layoutUpdate [options]: fire this event to change page layout options.
 *   For example, to hide sidebar from display and save this option to localStorage.
 *
 *** layoutRender: initial render of base layout.
 *   Layout options can be changed with layoutUpdate.
 *
 * Collection events
 * -----------------
 *
 *** collectionLoad [collection]: event fires when collection needs to be reloaded.
 *   Accept collection data.
 *   For example, search, pagination, filter categories
 *
 *** modelLoad [model]: filtered model from collection.
 *   Accept model object.
 *
 *
 * Form events
 * -----------
 *
 *** loginSuccess [user]: success user login.
 *   Accept user object.
 *
 *** loginFailed: failed user login.
 *
 *
 * Router events
 * -------------
 *
 *** userLogout: user logout action
 *
 *
 * Popup events
 * ------------
 *
 *** closePopup [view]: Nested into popup view triggers this event to close popup
 *   Accept triggered view object.
 *
 */

App.Helpers = {

    renderContent: function(content){
        $('.main-content').html( $('<div class="container-fluid" />').html(content) );
    },
    getTemplate: function(selector){
        return _.template($(selector).html());
    },

    elemToString: function(elem){
        var wrap = $('<div />').html(elem);
        return wrap.html();
    },

    loadFromCollection: function(options){
        var collection = options.collection,
            filter = options.filter,
            find = options.find;

        collection.fetch({
            success: success,
            error: error
        });

        function success(collection){
            var model;

            // Filter collection
            if(filter){
                collection.reset(collection.filter(filter));
                App.Vent.trigger('collectionLoad', collection);

            // Find model in collection
            } else if(find){
                model = collection.findWhere(find);
                if(model) App.Vent.trigger('modelLoad', model);

            } else {
                App.Vent.trigger('collectionLoad', collection);
            }
        }
        function error(collection, response){
            console.log(response.responseText);
            //MyApp.vent.trigger("search:error", response);
        }
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
    storage: (function(){
        var storeAPI,
            hasStorage = (function() {
                try {
                    localStorage.setItem('hello', 'world');
                    localStorage.removeItem('hello');
                    return true;
                } catch (exception) {
                    return false;
                }
            }());

        if(hasStorage)
            // Local storage get/set API
            storeAPI = {
                set: function(item, value){
                    if(arguments.length !== 2) return false;
                    localStorage[item] = JSON.stringify(value);
                    return true;
                },
                get: function(item){
                    if(arguments.length !== 1) return; //undefined
                    var value = localStorage[item];
                    return value ? JSON.parse(value) : value; //false value
                },
                remove: function(item){
                    localStorage.removeItem(item);
                }
            };
        else
            // Cookie get/set API
            storeAPI = {
                set: function(item, value){
                    if(arguments.length !== 2) return false;
                    var date = new Date(new Date().getTime() + 30 * 24 * 3600 * 1000);

                    document.cookie = item+'='+JSON.stringify(value)+'; path=/; expires='+date.toUTCString();
                    return true;
                },
                get: function(item){
                    if(arguments.length !== 1) return; //undefined
                    var value = App.Helpers.getQueryParam(item, document.cookie);
                    return value ? JSON.parse(value) : value; //false value
                },
                remove: function(item){
                    document.cookie = item+'=; path=/; expires='+(new Date).toUTCString();
                }
            };
        return storeAPI;
    })(),


    socSharingWindow: function(url, name) {
        if (window.showModalDialog) {
            window.showModalDialog(url, name, "dialogWidth:500px;dialogHeight:500px");
        } else {
            window.open(url, name, 'height=500,width=500,toolbar=no,directories=no,status=no,linemenubar = no,scrollbars = no,resizable=no,modal=yes');
        }
    }
};
App.set('model/User', Backbone.Model.extend({
    defaults: {
        avatar: '',
        fullname: '',
        username: '',
    }
}));
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
        username: '',
        password: ''
    },

    login: function(){

        // Front-end user login...
        var identity = this.toJSON(),
            users = App.create('collection/Users');

        users.fetch({
            success: success,
            error: error
        });

        function success(collection){
            var user = collection.findWhere(identity);
            user ?
                App.Vent.trigger('loginSuccess', user) :
                App.Vent.trigger('loginFailed');
        }
        function error(collection, response){
            console.log(response.responseText);
            //MyApp.vent.trigger("search:error", response);
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
 * Card model
 */
App.set('model/Card', 'content', Backbone.Model.extend({
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

    types: {
        0: 'Image',
        1: 'Video',
        2: 'Text'
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
    storage: App.Helpers.storage,

    // Initialize layout on application start
    initialize: function(){
        this.set( this.loadOptions() );
        this.listenTo(App.Vent, 'layoutChange', this.change);
    },

    loadOptions: function(){
        var options,
            defaultOptions = {
                withSidebar: false,
                sidebarCollapsed: false
            };
        options = _.defaults(this.storage.get('layout') || {}, defaultOptions);

        // Show sidebar only for authorized users
        options.withSidebar = !!App.getUser();
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
        this.storage.set('layout', this.toJSON());
    },

    //Functions predicates
    withSidebar: function(){
        return this.get('withSidebar');
    },
    sidebarCollapsed: function(){
        return this.get('sidebarCollapsed');
    },

    //Trigger functions
    toggleSidebar: function(){
        this.update({sidebarCollapsed: !this.get('sidebarCollapsed')});
        //this.set('sidebarCollapsed', );

        //After end of css toggle animation
        setTimeout(function(){
            App.Vent.trigger('layoutResize');
        }, 400);
    },

    menuItems: function(){
        // Items of topmenu. Text/url/show on login/logout
        var items = [
                ['Home', '#', {in: 1, out: 1}],
                ['Contacts', '#!/contacts', {in: 1, out: 1}],
                ['Sign in', '#!/account/signin', {in: 0, out: 1}],
                ['Log in <i class="icon-login"></i>', '#!/account/login', {in: 0, out: 1}],
                ['Log out <i class="icon-logout"></i>', '#!/account/logout', {in: 1, out: 0}]
            ],
            list = [],
            status = !!App.getUser() ? 'in' : 'out';

        $.each(items, function(index, item){
            // If menu item should show for user
            if ( item[2][status] )
                // Create DOM element
                list.push( App.Helpers.elemToString( $('<a />').attr('href', item[1]).html(item[0]) ));
        });
        return list;
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
App.set('collection/Cards', Backbone.Collection.extend({
    url: 'assets/js/database/cards.json',
    model: App.get('model/Card', 'content')
}));
App.set('collection/Users', Backbone.Collection.extend({
    url: 'assets/js/database/users.json',
    model: App.get('model/User')
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
            $inputs = $form.find(":input[name]:not([data-skip-validation], [type='file'])"),
            data, formData = {}, isValid = true;

        data = this.processData($inputs);

        // Set general validation flag
        // And compound formData
        _.each(data, function (obj) {
            formData[obj.name] = obj.value;
            var result = this.validateOne(obj);

            // Try to change general validation flag if
            if (isValid) isValid = result;
        }, this);

        if (isValid && this['submit'])
            this['submit'](e, formData);
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
        rules.required = rules.required !== void(0) ? rules.required : !!$target.attr('required');
        rules.pattern = $target.attr('pattern');
        rules.min = $target.attr('min');
        rules.max = $target.attr('max');


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


    // No events should be here for correct events
    // extension in child objects

    // Clear all inputs values
    clearInputs: function(){
        this.$(':input[name]').each(function(){
            $(this).val('');
        });
    },

    //This method used in child classes to extend child events with parent events (from validator)
    extendParentEvents: function(events){
        this.events = _.extend(App.get('view/Validator', 'form').prototype.events, events);
    }


}));
App.set('view/AccountDestroy', 'form', App.get('view/BaseForm', 'form').extend({

    template: App.Helpers.getTemplate('#profileDestroy'),

    events: {
        'click button': 'submit'
    },
    initialize: function(){
        this.model = App.getUser();
    },

    render: function(){
        this.setElement(this.template(this.model.toJSON()));
        return this;
    },

    submit: function(e){
        var $target = $(e.target);

        if($target.hasClass('destroy')){
            App.Vent.trigger('userLogout');
        }
        App.Vent.trigger('closePopup', this);
    }

}));
App.set('view/AccountEdit', 'form', App.get('view/BaseForm', 'form').extend({

    template: App.Helpers.getTemplate('#profileEdit'),

    events: {
        'change .account-avatar': 'loadImage'
    },

    initialize: function(){
        this.model = App.getUser();
        this.extendParentEvents(this.events);
    },

    render: function(){
        this.setElement(this.template(this.model.toJSON()));
        return this;
    },

    loadImage: function(e){
        var $target = $(e.target),
            image = $target.prop('files')[0],
            reader = new FileReader();

        if(image){
            reader.onload = function(e){
                this.$('img').attr('src', e.target.result);
            }.bind(this);
            reader.readAsDataURL(image);
        }
    },

    submit: function(e, data){
        this.model.set(data);
        App.Vent.trigger('closePopup', this);
    }

}));
App.set('view/AddCard', 'form', App.get('view/BaseForm', 'form').extend({

    template: App.Helpers.getTemplate('#addCard'),

    initialize: function(){
        this.model = this.model ? this.model : App.createContent('model/Card');
        this.extendParentEvents(this.events);
    },
    events: {
        'change select': 'dependentFields',
        'change #cardImage': 'imagePreview',
        'blur #cardVideo': 'videoPreview'
    },

    render: function(){
        this.setElement(this.template(this.model.toJSON()));
        return this;
    },

    submit: function(e, data){
        this.model.set(data);
        this.clearInputs();
        App.createWidget('Popup').render('Model successfully created', {toggle: true});
    },

    renderDropdown: function(){
        var $dropdown = $('<div />'),
            $tag, type = this.model.get('type');

        // Append blank option
        $dropdown.append( $('<option />').attr({selected: true, value: ''}).text('Select type') );

        // Append real options
        _.each(this.model.types, function(name, code){
            $tag = $('<option />').attr('value', code).text(name);
            if(type === code) $tag.attr('selected', true);
            $dropdown.append($tag);
        }, this);

        return $dropdown.html();
    },

    dependentFields: function (e) {
        var $target = $(e.target).find('option:selected'),
            pattern = new RegExp($target.text(), 'i'),
            $fields = this.$('.dependent-fields li'),
            $selected, $field;

        // Remove active class from all
        $fields.each(removeActive);

        // Search appropriative list to selected option
        $fields.each(function () {
            $field = $(this);
            if (pattern.test($field.data('type'))) $selected = $field;
        });

        // If found, set active class
        // Allow validation
        if ($selected) makeActive.call($selected);


        // Allow or disallow validation
        // Toggle from front-end
        function makeActive() {
            $(this).addClass('active')
                .find(':input[name]').removeAttr('data-skip-validation');
        }

        function removeActive() {
            $(this).removeClass('active')
                .find(':input[name]').attr('data-skip-validation', true);
        }

    },

    imagePreview: function(e){
        var $target = $(e.target),
            image = $target.prop('files')[0],
            reader = new FileReader();

        if(image){
            reader.onload = function(e){
                $target.after( $('<img />').attr({src: e.target.result}) );
            };
            reader.readAsDataURL(image);
        }
    },

    videoPreview: function(e){
        var $target = $(e.target),
            link = $target.val().trim(),
            $video;

        if(!link) return;

        $video = $('<iframe />').attr({
            src: '//www.youtube.com/embed/'+link+'?rel=0&amp;controls=0&amp;showinfo=0&amp;feature=oembed',
            frameborder: 0,
            width: '100%'
        });

        $target.after($video);
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
        this.model.set(data);
        this.model.send();
    },
    showResponse: function(){
        App.createWidget('Popup').render(this.model.response, {toggle: false, trigger: false});
        if(this.model.get('success')) this.clearInputs();
        this.model.clear({silent: true});
    }
}));
App.set('view/Login', 'form', App.get('view/BaseForm', 'form').extend({
    initialize: function(){
        this.listenTo(App.Vent, 'loginFailed', this.showFail);
    },
    template: App.Helpers.getTemplate('#loginForm'),
    render: function(){
        this.setElement( this.template() );
        return this;
    },
    submit: function(e, data){
        this.model.set(data);
        this.model.login();
    },

    showFail: function(){
        console.log('login attempt failed');
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
    events: {
        "submit form": 'submit',
        "keyup [name='s']": 'keyup'
    },
    template: App.Helpers.getTemplate('#searchform'),

    render: function(){
        this.$el.html( this.template() );
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
        var router = App.getRouter();
        s.length > 0 ?
            router.navigate('!/search/'+s, {trigger: true}) :
            router.navigate('', {trigger: true});
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
App.set('view/AccountInfo', 'content', App.get('view/BaseView').extend({

    template: App.Helpers.getTemplate('#accountInfo'),

    events: {
        "click .account-dropdown a[href='#!/account/edit']": 'edit',
        "click .account-dropdown a[href='#!/account/destroy']": 'destroy'
    },

    initialize: function(){
        this.model = App.getUser();
        this.listenTo(this.model, 'change', this.render);
    },

    render: function(){
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },

    edit: function(e){
        e.preventDefault();
        var $target = $(e.target),
            link = $target.attr('href').substr(1),
            currentRoute = Backbone.history.getFragment();

        App.getRouter().navigate(link);

        App.createWidget('Popup')
            .render(App.createForm('view/AccountEdit'), {
                redirect: function () {
                    App.getRouter().navigate(currentRoute);
                }
            });
    },

    destroy: function(e){
        e.preventDefault();
        var $target = $(e.target),
            link = $target.attr('href').substr(1),
            currentRoute = Backbone.history.getFragment();

        App.getRouter().navigate(link);

        App.createWidget('Popup')
            .render(App.createForm('view/AccountDestroy'), {
                redirect: function () {
                    App.getRouter().navigate(currentRoute);
                },
                size: 'sm'
            });
    }

}));
App.set('view/BaseCard', 'content', App.get('view/BaseView').extend({
    scaleMedia: function () {
        var video = this.$('.video-card iframe'),
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
        var media;

        // Create DOM element and push it to temp wrapper
        if( this.model.isVideo() ){
            media = $('<iframe />').attr({
                width: 640,
                height: 360,
                src: link,
                frameborder: 0,
                allowfullscreen: true
            });
        } else if(this.model.isImage() ){
            media = $('<img />').attr({
                src: link,
                alt: title,
                title: title
            });
        }

        return App.Helpers.elemToString(media);
    },

    // Return type of card
    typeClass: function(){
        return this.model.isImage() ? 'image-card' :
            this.model.isVideo() ? 'video-card' :
            'text-type';
    },

    // Render card link
    getLink: function(className){
        var link = $('<a />').attr({
            href: '#!/page/'+this.model.id,
            class: className
        });

        return App.Helpers.elemToString(link);
    },

    socialLinks: function(){
        var socials = [

        ];

        return [];
    }

}));


// Card toolbox view

App.set('view/CardToolbox', 'content', App.get('view/BaseView').extend({

    initialize: function() {
        this.model.on('change:favorites', this.render, this);
    },
    events: {
        'click .rate-button': 'toggleRate'
    },
    template: App.Helpers.getTemplate('#cardToolbox'),

    render: function(){
        this.$el.html( this.template( this.model.toJSON() ) );
        return this;
    },

    toggleRate: function(e){
        e.preventDefault();
        this.model.favoriteToggle();
    }
}));


App.set('view/Card', 'content', App.get('view/BaseCard', 'content').extend({
    initSubviews: function(){
        this.subviews = {};
        this.subviews['.toolbox'] = App.createContent('view/CardToolbox', {model: this.model});
        return this.subviews;
    },
    events: {
        'click .post-link': 'openInPopup'
    },

    mediaTemplate: App.Helpers.getTemplate('#mediaCard'),
    textTemplate: App.Helpers.getTemplate('#textCard'),

    render: function(){
        var type = this.model.isText() ? 'text' : 'media',
            template = this[type+'Template'](this.model.toJSON());

        this.setElement(template);
        this.assign( this.initSubviews() );

        if(this.model.isVideo()) this.scaleMedia();

        return this;
    },

    openInPopup: function(e){
        e.preventDefault();
        var id = this.model.get('id'),
            router = App.getRouter(),
            content = App.createContent('view/CardInPopup', {model: this.model});

        router.navigate('!/page/' + id);

        App.createWidget('Popup')
            .render(content, {
                // Redirect to index after close popup
                redirect: function () {
                    router.navigate('');
                }
            });
    }
}));


App.set('view/CardInPopup', 'content', App.get('view/BaseCard', 'content').extend({
    template: App.Helpers.getTemplate('#cardInPopup'),
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        if(this.model.isVideo()) this.scaleMedia();
        return this;
    }
}));



App.set('view/CardPage', 'layout', App.get('view/BaseCard', 'content').extend({

    className: 'container-fluid',
    template: App.Helpers.getTemplate('#cardPage'),
    initialize: function(){
        this.listenTo(App.Vent, 'modelLoad', this.render);
    },
    render: function(model){
        this.model = model;
        this.$el.html( this.template(model.toJSON()) );
        App.Helpers.renderContent(this.el);
        return this;
    },

    socialLinks: function(){
        var $links = $('<div />'), $link,
            url = window.location.host+'/?#'+Backbone.history.getFragment(),
            socs = [
                {name:'Facebook Share', text:'<i class="icon-facebook"></i>', link:'//www.facebook.com/sharer/sharer.php?u='+url},
                {name:'Twitter Share', text:'<i class="icon-twitter"></i>', link:'//twitter.com/home?status='+url},
                {name:'Google Share', text:'<i class="icon-gplus"></i>', link:'//plus.google.com/share?url='+url},
                {name:'Vkontakte Share', text:'<i class="icon-vkontakte"></i>', link:'//vk.com/share.php?url='+url},
                {name:'Pinterest Share', text:'<i class="icon-pinterest"></i>', link:'//www.pinterest.com/pin/create/button/?url='+url}
            ];

        _.each(socs, function(soc){
            $link = $('<li />').attr({
                onclick: "App.Helpers.socSharingWindow('"+soc.link+"', '"+soc.name+"'); return false"
            }).html(soc.text);
            $links.append($link);
        });
        return $links.html();
    }

}));
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

App.set('view/Topmenu', 'layout', App.get('view/BaseView').extend({

    template: App.Helpers.getTemplate('#topMenu'),

    initialize: function(){
        this.model = App.getLayout();
        this.listenTo(this.model, 'change:withSidebar', this.render);
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

App.set('view/Sidebar', 'layout', App.get('view/BaseView').extend({

    template: App.Helpers.getTemplate('#sidebarLayout'),

    initSubviews: function(){
        this.subviews = {};
        this.subviews['.account-info'] = App.createContent('view/AccountInfo');
        return this.subviews;
    },

    initialize: function(){
        this.model = App.getLayout();
        this.listenTo(this.model, 'change:sidebarCollapsed', this.toggleSidebar);

        // Remove if withSidebar changed (it will always change to false)
        //this.listenTo(this.model, 'change:withSidebar', this.remove);
    },

    render: function(){
        this.setElement(this.template());
        this.assign(this.initSubviews());

        this.$('.side-wrapper').slimScroll({
            height: '100%'
        });
        return this;
    },


    toggleSidebar: function(){
        this.model.sidebarCollapsed() ?
            this.$('.side-content').fadeOut(150) :
            this.$('.side-content').hide().delay(300).fadeIn(150);
    }
}));


// Content layout
// This layout includes top navigation menu, dynamic content wrapper and footer

App.set('view/MainContent', 'layout', App.get('view/BaseView').extend({

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
    toggleSidebar: function(e){
        e.preventDefault();
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
        this.listenTo(this.model, 'change:withSidebar', this.reset);
        this.listenTo(this.model, 'change:sidebarCollapsed', this.toggleSidebar);
    },

    render: function(){
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
    toggleSidebar: function(view, collapsed){
        collapsed ?
            this.$el.addClass('sidebar-collapsed') :
            this.$el.removeClass('sidebar-collapsed') ;
    },

    reset: function(){
        _.each(this.subviews, function(subview){
            subview.remove();
        });
        this.$el.html('').removeClass();
        this.render();
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

        var $table = $('<div class="popup-table" />'),
            $cell = $('<div class="popup-cell" />'),
            $content = $('<div class="popup-content" />');

        // Create popup structure
        // .popup -> .popup-container -> .popup-box -> content...
        this.$el.html($table.html($cell.html($content)));

        // Push content for popup to this element
        this.$content = $content;

        this.listenTo(App.Vent, 'closePopup', this.closeVent)
    },
    events: {
        //'click': 'closeHandler',
        'click .close-trigger, .popup-cell': 'closeHandler'
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

    // Event handler for click event
    closeHandler: function(e){
        if(e.target !== e.currentTarget) return;
        this.close();
    },

    // Event handler for vent triggered event
    closeVent: function(view){
        if(this.nestedView && this.nestedView.cid === view.cid)
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
        this.removeNestedView();
        this.redirect();
        this.remove();
    },

    // Methods are allow to work not only with plain text content,
    // but also with Backbone Views.

    getDataContent: function(data){
        if( data instanceof Backbone.View){
            this.nestedView = data;
            return data.render().el;
        }
        return data;
    },
    removeNestedView: function(){
        if(this.nestedView) this.nestedView.remove();
    }
}));
App.Router = Backbone.Router.extend({
    routes: {
        '(!/)': 'index',
        '!/account/signin': 'accountSignin',
        '!/account/login': 'accountLogin',
        '!/account/logout': 'accountLogout',
        '!/account/recover': 'accountRecover',
        '!/account/destroy': 'accountDestroy',
        '!/account/edit': 'accountEdit',
        '!/contacts': 'contacts',
        '!/page/:id': 'page',
        '!/search/:s': 'search',
        '!/uploads': 'uploads',
        '!/favorites': 'favorites',
        '!/add-card': 'addCard'
    },

    execute: function (callback, args/*, name*/) {

        if (this.view) this.view.remove();

        // Call new route to render view
        if (callback) callback.apply(this, args);
    },

    index: function(){
        App.Vent.trigger('layoutChange');
        this.view = App.createLayout('view/Cards');

        App.Helpers.loadFromCollection({
            collection: App.create('collection/Cards')
        });
    },


    // Forms
    // ==============
    accountLogin: function(){
        App.Vent.trigger('layoutChange', {sidebarCollapsed: true});
        this.view = App.createForm('view/Login', {model: App.createForm('model/Login')});

        App.Helpers.renderContent(this.view.render().el);
    },

    accountLogout: function(){
        App.Vent.trigger('userLogout');
        this.navigate('', {trigger: true, replace: true});
    },

    accountSignin: function(){
        App.Vent.trigger('layoutChange', {sidebarCollapsed: true});
        this.view = App.createForm('view/Sigin', {model: App.createForm('model/Sigin')});

        App.Helpers.renderContent(this.view.render().el);
    },

    accountRecover: function(){
        App.Vent.trigger('layoutChange', {sidebarCollapsed: true});
        this.view = App.createForm('view/Recover', {model: App.createForm('model/Recover')});

        App.Helpers.renderContent(this.view.render().el);
    },

    accountEdit: function(){
        App.Vent.trigger('layoutChange');
        this.view = App.createForm('view/AccountEdit');

        App.Helpers.renderContent(this.view.render().el);
    },

    addCard: function(){
        App.Vent.trigger('layoutChange');
        this.view = App.createForm('view/AddCard');

        App.Helpers.renderContent(this.view.render().el);
    },
    // ==============


    //Pages
    // ==============
    contacts: function(){
        App.Vent.trigger('layoutChange', {sidebarCollapsed: true});
        this.view = App.createLayout('view/Contacts').render();
    },

    search: function(s){
        App.Vent.trigger('layoutChange');
        this.view = App.createLayout('view/Cards');

        App.Helpers.loadFromCollection({
            collection: App.create('collection/Cards'),

            // Filtering function
            // Return every model, that content match to pattern
            filter: (function(){
                var pattern = new RegExp(s, 'i');
                return function(model){
                    return pattern.test(model.get('title')) || pattern.test(model.get('description'));
                }
            })()
        });
    },

    page: function(id){
        App.Vent.trigger('layoutChange');
        this.view = App.createLayout('view/CardPage');

        App.Helpers.loadFromCollection({
            collection: App.create('collection/Cards'),
            find: {id: parseInt(id)}
        });
    },

    // Filters
    // ==============
    uploads: function(){
        App.Vent.trigger('layoutChange');
        this.view = App.createLayout('view/Cards');

        App.Helpers.loadFromCollection({
            collection: App.create('collection/Cards'),

            // Filtering function
            // Return every model, that content match to pattern
            filter: (function(){
                var user = new RegExp(App.getUser().get('fullname'), 'i');
                return function(model){
                    return user.test(model.get('author'));
                }
            })()
        });
    },

    favorites: function(){
        App.Vent.trigger('layoutChange');
        this.view = App.createLayout('view/Cards');

        App.Helpers.loadFromCollection({
            collection: App.create('collection/Cards'),

            // Filtering function
            // Return every model, that content match to pattern
            filter: function(model){
                return model.get('isFavorite');
            }
        });
    }
});
App.State = new (Backbone.Model.extend({
    storage: App.Helpers.storage,
    defaults: {
        user: {},
        router: {},
        layout: {},
        query: {}
    },

    initialize: function(){
        this.listenTo(App.Vent, 'loginSuccess', this.userLogin);
        this.listenTo(App.Vent, 'userLogout', this.userLogout);
    },

    userLogin: function(user){
        this.set('user', user);
        this.storage.set('userId', user.id);

        // Go to index page after success login
        App.getRouter().navigate('', {trigger: true});
    },

    userLogout: function(){
        this.set('user', false);
        this.storage.remove('userId');
        this.storage.remove('layout');
        App.getRouter().navigate('', {trigger: true, replace: true});
    },

    run: function(){
        // Fetch user
        var self = this,
            id = this.storage.get('userId');

        if(id){
            // User was logged in, restore session
            App.create('collection/Users').fetch({
                success: function success(collection){
                    var user = collection.get(id);
                    if(user) self.set('user', user);

                    //Draw application layouts
                    self.draw();
                },
                error: function (collection, response){
                    console.log(response.responseText);
                }
            });
            return;
        }

        this.set('user', false);

        //Draw application layouts
        this.draw();
    },

    draw: function(){
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
