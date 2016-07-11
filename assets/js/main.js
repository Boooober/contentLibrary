(function($){

    $(document).ready(function(){
        var app = (function(){
            var elems = {
                wrapper: $('#wrapper'),
                sidebar: $('.navbar-static-side'),
                sidebarTrigger: $('.navbar-side-toggle')
            };


            //Init events
            function init(){

                //Sidebar toggle
                elems.sidebarTrigger.click(function(){
                    elems.wrapper.toggleClass('navbar-hide');
                    elems.sidebar.children().fadeToggle();
                });
            }

            //App API
            return {
                init:init
            }
        })();

        app.init();
    });




})(jQuery);