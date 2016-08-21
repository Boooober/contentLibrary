/**
 * This object implemets useful methods for validating form inputs
 * (c) 2016 Nikita Slobodian
 */

App.set('view/Validator', 'form', Backbone.View.extend({
    // Validation events
    events: {
        'submit form': 'submitForm',
        'blur input[name]': 'validateHandler'
    },

    // Validation on submitting form event handler
    // Submittion of this form should be implemented in successor object
    // If no errors occures on validation, fires submit method.
    submitForm: function(e){
        e.preventDefault();
        var $form = $(e.target),
            $inputs = $form.find(":input[name]:not([data-skip-validation], [type='file'])"),
            data, formData = {}, isValid = true;

        data = this.processData($inputs);

        // Set general validation flag
        // And compound formData
        _.each(data, function (obj) {
            formData[obj.name] = obj.value;
            var result = this.validateOne(obj);

            // Try to change general validation flag if
            if (isValid) isValid = result;
        }, this);

        if (isValid && this['submit'])
            this['submit'](e, formData);
    },


    /**
     *
     * Process inputs data.
     * @param {Array} inputs
     * @returns {Object} indexed by input name attribute with values {{$target: Object, value: string}}
     */
    processData: function(inputs){
        var data = {}, obj, $input;
        _.each(inputs, function(input){
            $input = $(input);
            obj = {
                $target: $input,
                value: $input.val().trim()
            };
            data[$input.attr('name')] = obj;
        });
        return data;
    },

    // Validate one currently blured input
    validateHandler: function(e){
        var data = this.processData($(e.target));
        _.each(data, this.validateOne, this);
    },

    /**
     * Validate one input
     * @param {{$target: Object, value: string}} data
     * @returns {boolean|*}
     */
    validateOne: function(data){
        var $target = data.$target,
            value = data.value,
            rules = $target.data('validate') || {},
            isValid, error;
        rules.type = $target.attr('type') || 'text';
        rules.required = rules.required !== void(0) ? rules.required : !!$target.attr('required');
        rules.pattern = $target.attr('pattern');
        rules.min = $target.attr('min');
        rules.max = $target.attr('max');


        // If current target type is number, than max and min validators behavior is different.
        // Validators should compare number value, not number string length.
        if( rules.type === 'number' && ($.isNumeric(rules.min) || $.isNumeric(rules.max))){
            rules.numMin = rules.min;
            rules.numMax = rules.max;

            // Set undefined value to skip them in validating loop
            rules.min = rules.max = undefined;
        }

        // If input value satisfied every validating rule, return true
        isValid = _.every(rules, function(rule, validator){
            if(rule !== 0 && !!rule){
                // If curret validator is 'type', check validation functions by value: 'email', 'number'
                if(validator === 'type') validator = rule;

                // If function return something, this is fail
                if(this.validators[validator])
                    error = this.validators[validator].call(this, rule, value);

            }
            return !error;
        }, this);

        this.toggleError($target, error);
        return isValid;
    },

    // Validating functions should not return enything if input is correct.
    // If validation fail, return error message.
    // Every validator accept input value and rule that input should match
    validators: {
        min: function(rule, value){
            if( !(value.length >= rule) )
                return 'Value length must be greater than '+rule+' symbols.'
        },
        max: function(rule, value){
            if( !(value.length <= rule) )
                return 'Value length must be less than '+rule+' symbols.';
        },
        numMin: function(rule, value){
            if( !(value >= rule) )
                return 'Number must be greater than '+rule+'.';
        },
        numMax: function(rule, value){
            if( !(value <= rule) )
                return 'Number must be less than '+rule+'.';
        },
        required: function(rule, value){
            if( !(value.length !== 0) )
                return 'Field value is required';
        },
        email: function(rule, value){
            var pattern = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
            ///^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
            if( !(pattern.test(value)) )
                return 'Incorrect email format';
        },
        number: function(rule, value){
            // In some reason, underscore _.isNumber() not working...
            if( !($.isNumeric(value)) )
                return 'Field value must be numeric';
        },
        equals: function(rule, value){
            var $twink = $(rule),
                name = $twink.attr('placeholder') || $("label[for='"+$twink.attr('id')+'"]').html();
            if( !($twink.val() === value) )
                return 'Field value must match '+name;
        },
        pattern: function(rule, value){
            if( !(new RegExp(rule).test(value)) )
                return 'Field value malformed';
        }
    },

    /**
     *
     * @param {Object} $target - jQuery DOM object
     * @param {(undefined|string)} error
     */
    toggleError: function($target, error){
        var $helpBlock = $target.next(),
            $container = $target.closest('.form-group'),
            $template = error ? $('<span class="help-block">'+error+'</span>') : '';

        if(error){
            $container.addClass('has-error').removeClass('has-success');
            $helpBlock.length !== 0 ?
                $helpBlock.replaceWith($template) :
                $target.after($template);
        } else {
            $container.addClass('has-success').removeClass('has-error');
            if($helpBlock) $helpBlock.remove();
        }
    }
}));