/**
 * Popup widget
 * (c) 2016 Nikita Slobodian
 */

App.set('view/Popup', 'widget', Backbone.View.extend({
    initialize: function(){
        this.setElement( $(document).find('.popup') );
        this.initial = this.$el.clone();
        this.$container = this.$('.popup-container');
        this.$box = $('<div class="popup-box" />');
    },
    events: {
        'click .close-trigger, .popup-container': 'closeHandler'
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
        css: {}
    },
    render: function(content, options){
        this.$el.css('z-index', 9999);
        this.$container.html( this.$box.append(content) );
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
                        if(debug) console.log('popup will close in '+options.toggleDelay+' ms');
                        this.$el.data('timeout', setTimeout(_.bind(this.close, this), options.toggleDelay));
                    }
                    break;
                case 'trigger':
                    if(value === true)
                        this.$box.append('<div class="close-trigger" />');
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
                    break;
            }
        }, this);
    },
    closeHandler: function(e){
        if(e.target !== e.currentTarget) return;
        this.close();
    },

    open: function(){
        this.$el.addClass('open--popup');
    },
    close: function(){
        var timeout = this.$el.data('timeout');
        if( timeout !== void(0) ) clearTimeout(timeout);

        this.$el.toggleClass('open--popup close--popup');
        setTimeout(_.bind(this.removePopup, this), 500);
    },
    removePopup: function(){
        this.$el.replaceWith(this.initial);
        this.remove();
    }
}));