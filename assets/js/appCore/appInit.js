(function(){
    var layoutModel = new App.Models.Layout(),
        wrapper = new App.Views.Wrapper({model: layoutModel}),
        indexCarts = new App.Collections.Carts(indexData), //database
        carts = new App.Views.Carts({collection: indexCarts});

    wrapper.render();
    $(window).load(function(e){
        wrapper.trigger('loaded', {e:e});
    });

    App.Helpers.renderContent(carts.render().el);
})();