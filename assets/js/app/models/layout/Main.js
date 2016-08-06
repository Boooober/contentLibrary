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