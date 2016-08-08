App.set('view/BaseCard', 'content', App.get('view/BaseView').extend({
    scaleMedia: function () {
        var video = this.$('.video-card iframe'),
            container = video.parent();
        var scaleMedia = function () {
            var ratio = container.width() / video.attr('width'),
                height = video.attr('height') * ratio;

            container.css('padding-bottom', height);
        }.bind(this);

        setTimeout(scaleMedia, 0);
        $(window).resize(scaleMedia);
        this.listenTo(App.Vent, 'layoutResize', scaleMedia);
    },

    processMediaTag: function(link, title){
        var media;

        // Create DOM element and push it to temp wrapper
        if( this.model.isVideo() ){
            media = $('<iframe />').attr({
                width: 640,
                height: 360,
                src: link,
                frameborder: 0,
                allowfullscreen: true
            });
        } else if(this.model.isImage() ){
            media = $('<img />').attr({
                src: link,
                alt: title,
                title: title
            });
        }

        return App.Helpers.elemToString(media);
    },

    // Return type of card
    typeClass: function(){
        return this.model.isImage() ? 'image-card' :
            this.model.isVideo() ? 'video-card' :
            'text-type';
    },

    // Render card link
    getLink: function(className){
        var link = $('<a />').attr({
            href: '#!/page/'+this.model.id,
            class: className
        });

        return App.Helpers.elemToString(link);
    },

    socialLinks: function(){
        var socials = [

        ];

        return [];
    }

}));

