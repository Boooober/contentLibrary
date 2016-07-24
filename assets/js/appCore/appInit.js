(function(){
    var indexCarts = new App.Collections.Carts(indexData);
    var carts = new App.Views.Carts({collection: indexCarts});
    App.Helpers.renderContent(carts.render().el);
})();