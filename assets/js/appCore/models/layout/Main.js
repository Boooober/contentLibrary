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