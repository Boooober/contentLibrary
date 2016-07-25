App.Models.SearchForm = Backbone.Model.extend({
    defaults: {
        s: App.Helpers.getQueryParam('s')
    },
    search: function(s){
        this.set('s', s);
        App.Vent.trigger('collectionFilter', this.toJSON());
    }
});