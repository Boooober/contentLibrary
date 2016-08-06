App.set('view/Page', 'content', App.get('view/BaseView').extend({
    //template: App.Helpers.template('#pageContent'),
    initialize: function(options){
        this.model = App.Query.get( options.id );
    },
    render: function(){
        var model = this.model.toJSON();
        this.setElement( this.template(this.model.toJSON()) );
        return this;
    }
}));