App.create('view/Wrapper', 'layout', {
    model: App.create('model/Main', 'layout')
});

new App.Router;
Backbone.history.start();
