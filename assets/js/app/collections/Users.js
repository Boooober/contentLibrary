App.set('collection/Users', Backbone.Collection.extend({
    url: 'assets/js/database/users.json',
    model: App.get('model/User')
}));