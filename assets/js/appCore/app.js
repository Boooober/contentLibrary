'use strict';
var debug = true;
var App = {

    //Namespace app structure
    //Models: {
    //    Forms: {},
    //    Content: {},
    //    Layouts: {}
    //},
    //Collections: {},
    //Views: {
    //    Forms: {},
    //    Content: {},
    //    Layouts: {}
    //},
    Vent: {},
    Helpers: {},


    /**
     * Methods below are shortcuts for App namespase structure
     * @param namespace - string which contains type/name of object. Example: Model/Sidebar
     * @param {Object} config - attributes/properties that will be set to new object instance
     * @returns {(Object|undefined)}
     */
    createForm: function(namespace, config){
        return this.create(namespace, 'form', config)
    },
    createLayout: function(namespace, config){
        return this.create(namespace, 'layout', config)
    },
    createContent: function(namespace, config){
        return this.create(namespace, 'content', config)
    },

    /**
     * This method designed for simple creating new object instances from App namespace.
     *
     * Accept three paramets in arguments object:
     *
     * {string} arguments[0] = namespace of object - Model/[name of the object];
     * {string} arguments[1] = type of object (optional) - Layout/[optional namespace]
     * {Object} arguments[2] = Object constructor params
     *
     * First two params define object namespace, so thay must be the save as params from declaration this object
     *
     */
    create: function(/*namespace, [type], config*/){
        var args = [].slice.call(arguments), object;

        // argument[1] is optional, so splice if it`s empty;
        if(args.length === 2 && _.isObject(args[1])) args.splice(1,0,undefined);

        object = this.get.apply(this, args);
        if(object){

            if(debug) console.log('New instance of '+this.getNamespace(args[0], args[1]).join('/')+' successfuly created');

            return new object(args[2]);
        }
    },

    /**
     * This method designed for simple getting objects from App namespace.
     *
     * Accept three paramets in arguments object:
     *
     * {string} arguments[0] = namespace of object - Model/[name of the object];
     * {string} arguments[1] = type of object (optional) - Layout/[optional namespace]
     *
     * This two params define object namespace, so thay must be the same as params from declaration this object
     *
     */
    get: function(/*namespace, [type]*/){
        var args = [].slice.call(arguments),
            path, obj;

        //if(args.length === 2) args.splice(1,0,undefined);
        path = this.getNamespace(args[0], args[1]);

        try{
            obj = (function deep(app, i){
                return path[i+1] ? deep(app[path[i]], ++i) : app[path[i]];
            })(this, 0);
            if(obj) return obj;
            if(debug) console.log('Path is correct, but object is missing... '+path.join('/'));
        } catch(e) {
            if(debug) console.log('No objects at '+path.join('/')+' exists');
        }
    },

    /**
     * This method designed for simple declaration objects in appropriative namespace of App.
     *
     * Accept three paramets in arguments object:
     *
     * {string} arguments[0] = namespace of object - Model/Sidebar;
     * {string} arguments[1] = type of object (optional) - Layout/[optional namespace]
     * {Object} arguments[2] = Object to set in current namespace
     *
     */
    set: function(/*namespace, [type], object*/){
        var args = [].slice.call(arguments),
            path, lvl;

        // argument[1] is optional, so splice if it`s empty;
        if(args.length === 2 && _.isObject(args[1])) args.splice(1,0,undefined);
        path = this.getNamespace(args[0], args[1]);

        return (function deep(app, i){
            lvl = path[i];
            // If current namespace lvl is not the last...
            return path[i+1] ?
                // Go deeper if already exists...   Or create new namespace
                (app[lvl] ? deep(app[lvl], ++i) : deep( (app[lvl] = {}), ++i) ) :
                //Last level, and it is already exists...   Create new object in namespace
                (app[lvl] ? 'Object is already exists.' : ( app[lvl] = args[2] ) );
        })(this, 0);
    },


    /**
     *
     * @param {string} namespace
     * @param {string} [type]
     * @returns {Array} - namespace of requested object in App
     */
    getNamespace: function(namespace, type) {
        var path = namespace.split('/'), i, l;
        if(type){
            // Check if type is a multilevel namespace
            type.search('/') !== 1 ?
                path.splice(1, 0, type) :
                path.splice(1, 0, this.getNamespace(type));
        }

        // Add 's' to all namespase element, except the last one,
        // so we can use 'model', 'view' in singular form.
        for(i = 0, l = path.length; i < l-1; i++){
            path[i] = path[i].replace(/([^s])$/, "$1s");
        }

        // Convers all first letters to uppercase
        path = _.map(path, function (letters) {
            return letters[0].toUpperCase() + letters.slice(1);
        });

        return path;
    }
};