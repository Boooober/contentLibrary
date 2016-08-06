// Navigation menu

App.set('view/Topmenu', 'layout', App.Views.BaseView.extend({
    initialize: function(){
        this.model = App.getState('Layout');
        this.model.on('change:withSidebar', this.render, this);
    },

    template: App.Helpers.getTemplate('#topMenu'),
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
    initialize: function(){
        this.model = App.getState('Layout');
        this.model.on('change:sidebarCollapsed', this.toggleSidebar, this);
    },
    template: App.Helpers.getTemplate('#sidebarLayout'),
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
    initialize: function(){
        this.model = App.getState('Layout');
    },
    events: {
        'click .sidebar-toggle': 'toggleSidebar'
    },
    template: App.Helpers.getTemplate('#pageLayout'),
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

    initialize: function(){
        this.model = App.getState('Layout');
        this.listenTo(App.Vent, 'layoutRender', this.render);
        this.model.on('change:sidebarCollapsed', this.toggleSidebar, this);
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

    template: App.Helpers.getTemplate('#wrapperAppends'),

    render: function(){
        this.$el.html('').removeClass();
        this.initSubviews();

        _.each(this.subviews, function(subview){
            this.$el.append(subview.render().el);
        }, this);
        this.$el.append( this.template() );
    },

    // Resize layouts width
    toggleSidebar: function(){
        this.$el.toggleClass('sidebar-collapsed');
    }

}));