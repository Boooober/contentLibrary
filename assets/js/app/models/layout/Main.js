App.set('model/Main', 'layout', Backbone.Model.extend({

    // Save layout options in storage
    storage: App.Helpers.storage('Layout'),

    // Initialize layout on application start
    initialize: function(){
        this.set( this.loadOptions() );
        this.listenTo(App.Vent, 'layoutChange', this.change);
    },

    loadOptions: function(){
        var options,
            defaultOptions = {
                withSidebar: false,
                sidebarCollapsed: true
            };
        options = _.defaults(this.storage.get(), defaultOptions);

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
        this.storage.set(this.toJSON());
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
                ['Log in <i class="icon-login"></i>', '#!/account/login', {in: 0, out: 1}],
                ['Sign in', '#!/account/signin', {in: 0, out: 1}],
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