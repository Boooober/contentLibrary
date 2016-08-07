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
            content = 'sdfasdfsdf' + id;

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


App.set('view/Cart', 'content', App.get('view/BaseView').extend({
    initSubviews: function(){
        this.subviews = {};
        this.subviews['.toolbox'] = App.createContent('view/CartToolbox', {model: this.model});
        return this.subviews;
    },

    //There are three content types:
    //0 => image, 1 => video, 3 => text
    //They are stored in array by indexes
    templates: [
        App.Helpers.getTypeTemplate('image'),
        App.Helpers.getTypeTemplate('video'),
        App.Helpers.getTypeTemplate('text')
    ],

    render: function(){
        var model = this.model.toJSON(),
            template = this.templates[model.type](model);

        this.setElement($(template));
        this.assign( this.initSubviews() );

        if(this.model.isVideo()) this.scaleMedia();

        return this;
    },

    scaleMedia: function(){
        var video = this.$('.video-frame iframe'),
            container = video.parent();
        var scaleMedia = function(){
            var ratio = container.width() / video.attr('width'),
                height = video.attr('height') * ratio;

            container.css('padding-bottom', height);
        }.bind(this);

        setTimeout(scaleMedia, 0);
        $(window).resize(scaleMedia);
        this.listenTo(App.Vent, 'layoutResize', scaleMedia);
    }
}));

