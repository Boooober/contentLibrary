App.set('model/Contact', 'form', App.get('model/BaseForm', 'form').extend({
    defaults: {
        name: '',
        email: '',
        message: ''
    },

    // Response from server
    response: '',

    send: function(){
        // Ajax sending to the server...
        console.log('Sending to server... Fake timeout 2s.', this.toJSON());

        // Do fake server response
        setTimeout(_.bind(function(){
            if(this.get('message') === 'error'){
                this.response = 'Some error occures while sending your message. Please, try again later';
                this.set('success', false);
            } else{
                this.response = 'Your message was successfully sent. We will contact you shortly';
                this.set('success', true);
            }
        }, this), 2000);

    }
}));