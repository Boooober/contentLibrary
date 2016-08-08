App.set('view/BaseForm', 'form', App.get('view/Validator', 'form').extend({


    // No events should be here for correct events
    // extension in child objects

    // Clear all inputs values
    clearInputs: function(){
        this.$(':input[name]').each(function(){
            $(this).val('');
        });
    },

    //This method used in child classes to extend child events with parent events (from validator)
    extendParentEvents: function(events){
        this.events = _.extend(App.get('view/Validator', 'form').prototype.events, events);
    }


}));