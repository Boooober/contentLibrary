App.Helpers = {

    renderContent: function(content){
        $('.page-content').html(content);
    },
    getTemplate: function(selector){
        return _.template($(selector).html());
    },

    getTypeTemplate: function(type){
        return this.getTemplate('#'+type+'Cart');
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
    storage: function(storeName){
        return (function(){
            var storeAPI,
                hasStorage = (function() {
                    try {
                        localStorage.setItem('test', 'hello');
                        localStorage.removeItem('test');
                        return true;
                    } catch (exception) {
                        return false;
                    }
                }());

            function getArgs(){
                var name, value;
                switch (arguments.length){
                    case 1:
                        name = storeName;
                        value = JSON.stringify(arguments[0]);
                        break;
                    case 2:
                        name = arguments[0];
                        value = JSON.stringify(arguments[1]);
                        break;
                    default:
                        return false;
                }
                return {
                    name: name,
                    value: value
                };
            }

            if(hasStorage)
                // Local storage get/set API
                storeAPI = {
                    set: function(){
                        var args = getArgs.apply(this, arguments);
                        if(args){
                            localStorage[args.name] = args.value;
                            return true;
                        }
                        return false;
                    },
                    get: function(option){
                        option = option || storeName;
                        return JSON.parse(localStorage[option] || '{}');
                    }
                };
            else
                // Cookie get/set API
                storeAPI = {
                    set: function(){
                        var args = getArgs.apply(this, arguments),
                            date = new Date(new Date().getTime() + 30 * 24 * 3600 * 1000);
                        if(args){
                            document.cookie = args.name+'='+args.value+'; path=/; expires='+date.toUTCString();
                            return true;
                        }
                        return false;
                    },
                    get: function(option){
                        option = option || storeName;
                        return JSON.parse(App.Helpers.getQueryParam(option, document.cookie) || '{}');
                    }
                };
            return storeAPI;
        })();
    }
};