(function(){
    var layoutModel = new App.Models.Layout(),
        wrapper = new App.Views.Wrapper({model: layoutModel}),
        collection = new App.Collections.Carts,
        carts = new App.Views.Carts;

    collection.fetch({
        success: success,
        error: error
    });

    wrapper.render();
    $(window).load(function(e){
        wrapper.trigger('loaded', {e:e});
    });

    function success(){
        App.Vent.trigger('collectionLoad', collection);
        App.Helpers.renderContent(carts.render().el);
    }
    function error(collection, response){
        console.log(response.responseText);
        //MyApp.vent.trigger("search:error", response);
    }

})();