App.set('collection/Carts', Backbone.Collection.extend({
    url: 'assets/js/database/carts.json',
    model: App.get('model/Cart', 'content')
}));