App.set('view/AddCard', 'form', App.get('view/BaseForm', 'form').extend({

    template: App.Helpers.getTemplate('#addCard'),

    initialize: function(){
        this.model = this.model ? this.model : App.createContent('model/Card');
        this.extendParentEvents(this.events);
    },
    events: {
        'change select': 'dependentFields'
    },

    render: function(){
        this.setElement(this.template(this.model.toJSON()));
        return this;
    },

    submit: function(e, data){
        this.model.set(data);
    },

    renderDropdown: function(){
        var $dropdown = $('<div />'),
            $tag, type = this.model.get('type');

        _.each(this.model.types, function(name, code){
            $tag = $('<option />').attr('value', code).text(name);
            if(type === code) $tag.attr('selected', true);
            $dropdown.append($tag);
        }, this);

        return $dropdown.html();
    },


    dependentFields: function (e) {
        var $target = $(e.target).find('option:selected'),
            pattern = new RegExp($target.text(), 'i'),
            $fields = this.$('.dependent-fields li'),
            $selected, $field;

        // Remove active class from all
        $fields.each(removeActive);

        // Search appropriative list to selected option
        $fields.each(function () {
            $field = $(this);
            if (pattern.test($field.data('type'))) $selected = $field;
        });

        // If found, set active class
        // Allow validation
        if ($selected) makeActive.call($selected);


        // Allow or disallow validation
        // Toggle from front-end
        function makeActive() {
            $(this).addClass('active')
                .find(':input[name]').removeAttr('data-skip-validation');
        }

        function removeActive() {
            $(this).removeClass('active')
                .find(':input[name]').attr('data-skip-validation', true);
        }

    }




}));