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

            if(hasStorage)
                storeAPI = {
                    set: function(){
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
                        localStorage[name] = value;
                        return true;
                    },
                    get: function(option){
                        option = option || storeName;
                        return JSON.parse(localStorage[option] || '{}');
                    }
                };
            else
                storeAPI = {
                    set: function(){
                        var name, value,
                            date = new Date(new Date().getTime() + 30 * 24 * 3600 * 1000);

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
                        document.cookie = name+'='+value+'; path=/; expires='+date.toUTCString();
                        return true;
                    },
                    get: function(option){
                        option = option || storeName;
                        return JSON.parse(App.Helpers.getQueryParam(option, document.cookie || '{}'));
                    }
                };
            return storeAPI;
        })();
    }
};