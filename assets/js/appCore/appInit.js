(function(){
    var layoutModel = new App.Models.Layout(),
        wrapper = new App.Views.Wrapper({model: layoutModel});

    wrapper.render();
    //$(window).load(function(e){
    //    wrapper.trigger('loaded', {e:e});
    //});

})();