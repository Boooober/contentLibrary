App.set('view/CardPage', 'layout', App.get('view/BaseCard', 'content').extend({

    className: 'container-fluid',
    template: App.Helpers.getTemplate('#cardPage'),
    initialize: function(){
        this.listenTo(App.Vent, 'modelLoad', this.render);
    },
    render: function(model){
        this.model = model;
        this.$el.html( this.template(model.toJSON()) );
        App.Helpers.renderContent(this.el);
        return this;
    },

    socialLinks: function(){
        var $links = $('<div />'), $link,
            url = window.location.host+'/?#'+Backbone.history.getFragment(),
            socs = [
                {name:'Facebook Share', text:'<i class="icon-facebook"></i>', link:'//www.facebook.com/sharer/sharer.php?u='+url},
                {name:'Twitter Share', text:'<i class="icon-twitter"></i>', link:'//twitter.com/home?status='+url},
                {name:'Google Share', text:'<i class="icon-gplus"></i>', link:'//plus.google.com/share?url='+url},
                {name:'Vkontakte Share', text:'<i class="icon-vkontakte"></i>', link:'//vk.com/share.php?url='+url},
                {name:'Pinterest Share', text:'<i class="icon-pinterest"></i>', link:'//www.pinterest.com/pin/create/button/?url='+url}
            ];

        _.each(socs, function(soc){
            $link = $('<li />').attr({
                onclick: "App.Helpers.socSharingWindow('"+soc.link+"', '"+soc.name+"'); return false"
            }).html(soc.text);
            $links.append($link);
        });
        return $links.html();
    }

}));