// Google map styled by Snazzy Maps
App.set('view/GoogleMap', 'widget', Backbone.View.extend({

    initialize: function(){
        this.model = App.create('model/GoogleMap', 'widget');
    },
    apiKey: '',

    render: function(){
        (!window.google || !(window.google && window.google.maps)) ?
            $.getScript('//maps.googleapis.com/maps/api/js?key='+this.apiKey, _.bind(this.renderMap, this)) :
            this.renderMap();
    },

    renderMap: function(){
        var options,
            LatLng = new google.maps.LatLng(this.model.get('lat'), this.model.get('lng'));

        options = {
            center: LatLng,
            zoom: this.model.get('zoom'),
            styles: this.model.get('styles'),
            scrollwheel: this.model.get('scrollwheel')
        };

        if(!this.map){
            this.map = new google.maps.Map(this.el, options);

            _.each(this.model.get('markers'), function(marker){
                new google.maps.Marker({
                    position: new google.maps.LatLng(marker.lat, marker.lng),
                    map: this.map,
                    title: marker.title
                });
            }, this);
        }
    }
}));

