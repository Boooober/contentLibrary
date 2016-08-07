App.set('view/BaseCart', 'content', App.get('view/BaseView').extend({
    scaleMedia: function () {
        var video = this.$('.video-cart iframe'),
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
        var wrap = $('<div />');

        // Create DOM element and push it to temp wrapper
        if( this.model.isVideo() ){
            wrap.append($('<iframe />').attr({
                width: 640,
                height: 360,
                src: link,
                frameborder: 0,
                allowfullscreen: true
            }));
        } else if(this.model.isImage() ){
            wrap.append($('<img />').attr({
                src: link,
                alt: title,
                title: title
            }));
        }

        // Return text representation of DOM element
        // To use it in template
        return wrap.html();
    },

    // Return type of cart
    typeClass: function(){
        return this.model.isImage() ? 'image-cart' :
            this.model.isVideo() ? 'video-cart' :
            'text-type';
    },

    // Render cart link
    getLink: function(className){
        var wrap = $('<div />');

        wrap.append($('<a />').attr({
            href: '#!/page/'+this.model.id,
            class: className
        }));

        return wrap.html();
    }

}));

