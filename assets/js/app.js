var App = (function(){

    var Helper = {
        getTemplate: function(selector){
            return _.template($(selector).html());
        },
        getTypeTemplate:function(type){
            return this.getTemplate('#'+type+'Cart');
        },
        renderContent: function(content){
            $('.page-content').html(content);
        }
    };


    var CartModel = Backbone.Model.extend({
        defaults: {
            id: '',
            type: '',

            title: '',
            content: '',
            author: '',
            featureLink: '',
            votes: 0
        }
    });

    var CartCollection = Backbone.Collection.extend({
        model:CartModel
    });

    var indexCarts = new CartCollection(indexData);


    var CartView = Backbone.View.extend({
        className: 'col-sm-4',
        //Subscribe on model change events
        initialize: function(){
            this.model.on('change', this.render, this);
        },
        templates: [
            Helper.getTypeTemplate('image'), // 0 => image
            Helper.getTypeTemplate('video'), // 1 => video
            Helper.getTypeTemplate('text')   // 2 => text
        ],
        render: function(){
            var model = this.model.toJSON();
            //console.log(model.type);
            this.$el.html(this.templates[model.type](model));
            return this;
        }
    });

    var CartViews = Backbone.View.extend({
        className: 'row',
        render: function(){
            this.collection.each(this.addOne, this);
            return this;
        },
        addOne: function(cart){
            var cartView = new CartView({model:cart});
            this.$el.append(cartView.render().el);
        }
    });

    var carts = new CartViews({collection: indexCarts});
    Helper.renderContent(carts.render().el);


})();