// Cart toolbox view

App.set('view/CartToolbox', 'content', App.get('view/BaseView').extend({

    initialize: function() {
        this.model.on('change:favorites', this.render, this);
    },
    events: {
        'click .rate-button': 'toggleRate',
        'click .post-link': 'openInPopup'
    },
    template: App.Helpers.getTemplate('#cartToolbox'),

    render: function(){
        this.$el.html( this.template( this.model.toJSON() ) );
        return this;
    },

    toggleRate: function(e){
        e.preventDefault();
        this.model.favoriteToggle();
    },

    openInPopup: function(e){
        e.preventDefault();
        var id = this.model.get('id'),
            router = App.getRouter(),
            content = App.createContent('view/CartInPopup', {model: this.model});

        router.navigate('!/page/' + id);

        App.create('view/Popup', 'widget')
            .render(content, {

                // Redirect to index after close popup
                redirect: function () {
                    router.navigate('');
                }
            });
    }
}));


App.set('view/Cart', 'content', App.get('view/BaseCart', 'content').extend({
    initSubviews: function(){
        this.subviews = {};
        this.subviews['.toolbox'] = App.createContent('view/CartToolbox', {model: this.model});
        return this.subviews;
    },

    mediaTemplate: App.Helpers.getTemplate('#mediaCart'),
    textTemplate: App.Helpers.getTemplate('#textCart'),

    render: function(){
        var type = this.model.isText() ? 'text' : 'media',
            template = this[type+'Template'](this.model.toJSON());

        this.setElement(template);
        this.assign( this.initSubviews() );

        if(this.model.isVideo()) this.scaleMedia();

        return this;
    }
}));

