// BaseView for views with subviews.
// Extended with helpful methods for rendering DOM
App.set('view/BaseView', Backbone.View.extend({

    // https://ianstormtaylor.com/assigning-backbone-subviews-made-even-cleaner
    // https://ianstormtaylor.com/rendering-views-in-backbonejs-isnt-always-simple
    // Render subviews with delegating events;
    assign: function(selector, view){
        var selectors;

        if(_.isObject(selector)){
            selectors = selector;
        } else {
            selectors = {};
            selectors[selector] = view;
        }
        if(!selectors) return;

        _.each(selectors, function(view, selector){
            view.setElement(this.$(selector)).render();
        }, this);
    },

    // Idea from http://mikeygee.com/blog/backbone.html
    // Remove all subviews after closing current
    remove: function(){
        if( this.subviews ){
            _.each(this.subviews, function(subview){
                subview.remove();
            });
        }
        Backbone.View.prototype.remove.call(this);
    }
}));