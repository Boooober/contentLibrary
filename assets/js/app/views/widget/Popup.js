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