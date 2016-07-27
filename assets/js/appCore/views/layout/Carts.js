App.Views.Carts = Backbone.View.extend({
    className: 'row',

    initialize: function(){
        this.listenTo(App.Vent, 'collectionLoad', this.setCollection);
    },

    setCollection: function(collection){
        if(!this.collection){
            this.collection = collection;
            this.listenTo(this.collection, 'reset', this.redraw);
        }else{
            this.collection.reset(collection.models);
        }
    },

    render: function(){
        var models = this.collection.models,
            $root = this.$el, items,
            view, $el, i, l;

        //$root.masonry({
        //    itemSelector: '.cart-item',
        //    columnWidth: $el[0],
        //    percentPosition: true
        //});


        i = 0;
        l = models.length;
        (function addByOne(model){
            view = new App.Views.Cart({model: model});
            $el = view.render().$el;
            $root.append($el);

            //Init masonry layout
            if(i === 0){


                setTimeout(function(){
                    $root.masonry({
                        itemSelector: '.cart-item',
                        columnWidth: $el[0],
                        percentPosition: true
                    });
                },0);

            }



            if((items = $el.find('img, iframe, video')).length !== 0){
                items.on('load', masonryItem);
            }else{
                masonryItem();
            }

            // Recursion load next item
            function masonryItem(){
                $root.masonry('appended', $el);
                if(++i < l) addByOne(models[i]);
            }

        })(models[i]);

        this.listenTo(App.Vent, 'layoutResize', function(){
            $root.masonry();
        });

        return this;
    },


    redraw: function(){
        this.reset().render();
    },

    reset: function(){
        this.$el.html('');
        return this;
    }

    //masonry: function(){
    //    //Find all external media resources
    //    var items = this.$('iframe, img, video'),
    //        l = items.length, count = 0;
    //
    //    //Init masonry event handler function
    //    var masonry = function () {
    //        this.$el.masonry({
    //            columnWidth: this.$('.cart-item')[0],
    //            itemSelector: '.cart-item',
    //            percentPosition: true
    //        });
    //    }.bind(this);
    //
    //    //Fire masonry init when all resourses are loaded
    //    items.load(function(){
    //        if(++count < l) return;
    //        masonry();
    //    });
    //    this.listenTo(App.Vent, 'layoutResize', masonry);
    //}

});

