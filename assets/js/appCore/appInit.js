(function(){
    var layoutModel = new App.Models.Layout(),
        indexCarts = new App.Collections.Carts(indexData), //database
        carts = new App.Views.Carts({collection: indexCarts});

    wrapper = new App.Views.Wrapper({model: layoutModel});
    wrapper.render();

    $(window).load(function(e){
        wrapper.trigger('loaded', {e:e});
    });

    App.Helpers.renderContent(carts.render().el);
})();