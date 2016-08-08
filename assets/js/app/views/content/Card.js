// Card toolbox view

App.set('view/CardToolbox', 'content', App.get('view/BaseView').extend({

    initialize: function() {
        this.model.on('change:favorites', this.render, this);
    },
    events: {
        'click .rate-button': 'toggleRate',
    },
    template: App.Helpers.getTemplate('#cardToolbox'),

    render: function(){
        this.$el.html( this.template( this.model.toJSON() ) );
        return this;
    },

    toggleRate: function(e){
        e.preventDefault();
        this.model.favoriteToggle();
    }
}));


App.set('view/Card', 'content', App.get('view/BaseCard', 'content').extend({
    initSubviews: function(){
        this.subviews = {};
        this.subviews['.toolbox'] = App.createContent('view/CardToolbox', {model: this.model});
        return this.subviews;
    },
    events: {
        'click .post-link': 'openInPopup'
    },

    mediaTemplate: App.Helpers.getTemplate('#mediaCard'),
    textTemplate: App.Helpers.getTemplate('#textCard'),

    render: function(){
        var type = this.model.isText() ? 'text' : 'media',
            template = this[type+'Template'](this.model.toJSON());

        this.setElement(template);
        this.assign( this.initSubviews() );

        if(this.model.isVideo()) this.scaleMedia();

        return this;
    },

    openInPopup: function(e){
        e.preventDefault();
        var id = this.model.get('id'),
            router = App.getRouter(),
            content = App.createContent('view/CardInPopup', {model: this.model});

        router.navigate('!/page/' + id);

        App.createWidget('Popup')
            .render(content, {
                // Redirect to index after close popup
                redirect: function () {
                    router.navigate('');
                }
            });
    }
}));

