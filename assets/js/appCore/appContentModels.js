/**
 * Cart model
 */
App.Models.Cart = Backbone.Model.extend({
    defaults: {
        id: '',
        type: '',

        title: '',
        content: '',
        author: '',
        mediaLink: '',
        favorites: 0,

        isFavorite: false
    },

    favoriteToggle: function(){
        var count = this.get('favorites'),
            favorite = this.get('isFavorite');

        this.set('isFavorite', !favorite);
        this.set('favorites', favorite ? --count : ++count);
    }

});