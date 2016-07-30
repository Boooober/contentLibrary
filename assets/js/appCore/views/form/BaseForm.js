App.set('view/BaseForm', 'form', App.get('view/Validator', 'form').extend({

    // Clear all inputs values
    clearInputs: function(){
        this.$(':input[name]').each(function(){
            $(this).val('');
        });
    }
}));