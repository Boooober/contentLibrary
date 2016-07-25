App.Models.Layout = Backbone.Model.extend({
    defaults: {
        layout: 'withSidebar', //'withSidebar' or 'single'
        sidebarCollapsed: true
    },
    withSidebar: function(){
        return this.get('layout') === 'withSidebar';
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
    }
});