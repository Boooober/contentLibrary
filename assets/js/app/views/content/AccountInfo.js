App.set('view/AccountInfo', 'content', App.get('view/BaseView').extend({

    template: App.Helpers.getTemplate('#accountInfo'),

    events: {
        'click .account-dropdown a': 'edit'
    },

    initialize: function(){
        this.model = App.getUser();
        this.listenTo(this.model, 'change', this.render);
    },

    render: function(){
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },

    edit: function(e){
        e.preventDefault();
        var $target = $(e.target),
            link = $target.attr('href').substr(1),
            currentRoute = Backbone.history.getFragment();

        App.getRouter().navigate(link);

        App.createWidget('Popup')
            .render(App.createForm('view/AccountEdit'), {
                redirect: function () {
                    App.getRouter().navigate(currentRoute);
                }
            });



    }
}));