App.Models.SearchForm = Backbone.Model.extend({
    defaults: {
        s: App.Helpers.getQueryParam('s')
    }
});