App.Models.Layout = Backbone.Model.extend({
    initialize: function(){
        this.listenTo(App.Vent, 'layoutRedraw', this.redraw);
    },
    defaults: {
        sidebar: true,
        sidebarCollapsed: true
    },
    withSidebar: function(){
        return this.get('sidebar');
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
    },

    redraw: function(options){
        this.set(options);
        this.trigger('redraw');
    }

});