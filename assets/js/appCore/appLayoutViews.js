// Navigation menu

App.Views.Topmenu = App.Views.BaseView.extend({
    template: App.Helpers.getTemplate('#topMenu'),
    render: function(){
        this.$el.html( this.template() );
        return this;
    }
});



// Sidebar layout

App.Views.SidebarLayout = App.Views.BaseView.extend({
    initialize: function(){
        this.model.on('change:sidebarCollapsed', this.toggleSidebar, this);
        this.subviews['.searchform'] = new App.Views.SearchForm({model: new App.Models.SearchForm});
    },
    subviews: {},
    template: App.Helpers.getTemplate('#sidebarLayout'),
    render: function(){
        this.setElement( this.template() );
        this.assign( this.subviews );
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
});



// Content layout
// This layout includes top navigation menu, dynamic content wrapper and footer

App.Views.ContentLayout = App.Views.BaseView.extend({
    initialize: function(){
        this.subviews['.topmenu'] = new App.Views.Topmenu;
    },
    events: {
        'click .sidebar-toggle': 'toggleSidebar'
    },
    subviews: {},

    template: App.Helpers.getTemplate('#pageLayout'),
    render: function () {
        this.setElement(this.template());
        this.assign(this.subviews);
        return this;
    },

    toggleSidebar: function(){
        this.model.toggleSidebar();
    }
});


// Main wrapper

App.Views.Wrapper = App.Views.BaseView.extend({
    el: '#wrapper',
    initialize: function(){

        this.on('loaded', this.loaded, this);
        this.model.on('change:sidebarCollapsed', this.toggleSidebar, this);
        this.model.on('redraw', this.render, this);

        if(this.model.withSidebar()){
            this.$el.addClass('with-sidebar');
            this.subviews[0] = new App.Views.SidebarLayout({model: this.model});

            if(this.model.sidebarCollapsed())
                this.$el.addClass('sidebar-collapsed');
        }
        this.subviews[1] = new App.Views.ContentLayout({model: this.model});
    },
    subviews: {},
    template: App.Helpers.getTemplate('#wrapperAppends'),
    render: function(){
        this.$el.html('');
        _.each(this.subviews, function(subview){
            this.$el.append(subview.render().el);
        }, this);
        this.$el.append( this.template() );
    },

    loaded: function(e){
        this.$('.preloader').fadeOut();
    },

    // Resize layouts width
    toggleSidebar: function(){
        this.$el.toggleClass('sidebar-collapsed');
    }
});