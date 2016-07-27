App.Views.Forms.BaseForm = Backbone.View.extend({
    events: {
        'submit form': 'submit',
        'blur input[name]': 'validate'
    },
    render: function(){
        this.setElement( this.template() );
        return this;
    },

    setError: function(target, message){
        var $template = $('');

    },
    removeError: function(){

    },

    validate: function(e){
        var target = $(e.target),
            value = target.val().trim(),
            rules = target.data('validate') || {};
        rules.type = target.attr('type') || 'text';
        rules.required = !!target.attr('required');

        // If current target type is number, than max and min validators behavior is different.
        // Validators should compare number value, not number string length.
        if( rules.type === 'number' && ($.isNumeric(rules.min) || $.isNumeric(rules.max))){
            rules.numMin = rules.min;
            rules.numMax = rules.max;

            // Set undefined value to skip them in validating loop
            rules.min = rules.max = undefined;
        }

        // If input value satisfied every validating rule, return true
        _.every(rules, function(rule, validator){
            if(!_.isUndefined(rule)){
                // If curret validator is 'type', check validation functions by value: 'email', 'number'
                if(validator === 'type') validator = rule;

                if(this.validators[validator]){
                    return this.validators[validator].call(this, rule, value);
                }
            }
            return true;
        }, this);

    },

    // Validating functions
    // Must be function predicate
    validators: {
        min: function(rule, value){
            return value.length >= rule;
        },
        max: function(rule, value){
            return value.length <= rule;
        },
        numMin: function(rule, value){
            return value >= rule;
        },
        numMax: function(rule, value){
            return value <= rule;
        },
        required: function(rule, value){
            return value.length !== 0;
        },
        email: function(rule, value){
            var pattern = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
            return pattern.test(value);
        },
        number: function(rule, value){
            // In some reason, underscore _.isNumber() not working...
            return $.isNumeric(value);
        }
    }
});