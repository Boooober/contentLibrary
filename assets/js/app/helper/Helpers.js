App.Helpers = {

    renderContent: function(content){
        $('.main-content').html( $('<div class="container-fluid" />').html(content) );
    },
    getTemplate: function(selector){
        return _.template($(selector).html());
    },

    elemToString: function(elem){
        var wrap = $('<div />').html(elem);
        return wrap.html();
    },

    loadFromCollection: function(options){
        var collection = options.collection,
            filter = options.filter,
            find = options.find;

        collection.fetch({
            success: success,
            error: error
        });

        function success(collection){
            var model;

            // Filter collection
            if(filter){
                collection.reset(collection.filter(filter));
                App.Vent.trigger('collectionLoad', collection);

            // Find model in collection
            } else if(find){
                model = collection.findWhere(find);
                if(model) App.Vent.trigger('modelLoad', model);

            } else {
                App.Vent.trigger('collectionLoad', collection);
            }
        }
        function error(collection, response){
            console.log(response.responseText);
            //MyApp.vent.trigger("search:error", response);
        }
    },


    getQueryParam: function(param, source){
        var params, i, l, data;
        source = source || window.location.search.substring(1);
        if(!source) return '';

        params = source.search('&') !== -1 ? source.split('&') : source.split('; ');
        for(i = 0, l = params.length; i<l; i++){
            data = params[i].split('=');
            if(new RegExp(param, 'i').test(data[0])) return data[1];
        }
        return '';
    },
    storage: (function(){
        var storeAPI,
            hasStorage = (function() {
                try {
                    localStorage.setItem('hello', 'world');
                    localStorage.removeItem('hello');
                    return true;
                } catch (exception) {
                    return false;
                }
            }());

        if(hasStorage)
            // Local storage get/set API
            storeAPI = {
                set: function(item, value){
                    if(arguments.length !== 2) return false;
                    localStorage[item] = JSON.stringify(value);
                    return true;
                },
                get: function(item){
                    if(arguments.length !== 1) return; //undefined
                    var value = localStorage[item];
                    return value ? JSON.parse(value) : value; //false value
                },
                remove: function(item){
                    localStorage.removeItem(item);
                }
            };
        else
            // Cookie get/set API
            storeAPI = {
                set: function(item, value){
                    if(arguments.length !== 2) return false;
                    var date = new Date(new Date().getTime() + 30 * 24 * 3600 * 1000);

                    document.cookie = item+'='+JSON.stringify(value)+'; path=/; expires='+date.toUTCString();
                    return true;
                },
                get: function(item){
                    if(arguments.length !== 1) return; //undefined
                    var value = App.Helpers.getQueryParam(item, document.cookie);
                    return value ? JSON.parse(value) : value; //false value
                },
                remove: function(item){
                    document.cookie = item+'=; path=/; expires='+(new Date).toUTCString();
                }
            };
        return storeAPI;
    })(),


    socSharingWindow: function(url, name) {
        if (window.showModalDialog) {
            window.showModalDialog(url, name, "dialogWidth:500px;dialogHeight:500px");
        } else {
            window.open(url, name, 'height=500,width=500,toolbar=no,directories=no,status=no,linemenubar = no,scrollbars = no,resizable=no,modal=yes');
        }
    }
};