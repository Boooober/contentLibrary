App.set('state/Layout', App.create('model/Main', 'layout'));
App.create('view/Wrapper', 'layout', {
    model: App.getState('Layout')
});
new App.Router;
Backbone.history.start();
