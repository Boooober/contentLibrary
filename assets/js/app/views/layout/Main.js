// Navigation menu

App.set('view/Topmenu', 'layout', App.get('view/BaseView').extend({

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

App.set('view/Sidebar', 'layout', App.get('view/BaseView').extend({

    template: App.Helpers.getTemplate('#sidebarLayout'),

    initialize: function(){
        this.model = App.getLayout();
        this.model.on('change:sidebarCollapsed', this.toggleSidebar, this);

        // Remove if withSidebar changed (it will always change to false)
        this.model.on('change:withSidebar', this.remove, this);
    },

    render: function(){
        this.setElement( this.template( App.getUser().toJSON() ) );
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