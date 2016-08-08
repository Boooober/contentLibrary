App.set('collection/Cards', Backbone.Collection.extend({
    url: 'assets/js/database/cards.json',
    model: App.get('model/Card', 'content')
}));