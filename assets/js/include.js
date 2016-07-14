(function($){

    //var App = (function(){
    //
    //    var elems, //Object of jQuery elements. Init on ready stage
    //        mainContent;
    //
    //
    //    function findElements(){
    //        elems = (function(selectors){
    //            var elements = {};
    //            for(var selector in selectors){
    //                if(selectors.hasOwnProperty(selector)){
    //                    elements[selector] = selectors[selector];
    //                    elements['$'+selector] = $(selectors[selector]);
    //                }
    //            }
    //            return elements;
    //
    //        //Find DOM elements
    //        })({
    //            wrapper:        '#wrapper',
    //            content:        '.page-content',
    //            preloader:      '.preloader',
    //            sidebar:        '.navbar-static-side',
    //            sidebarTrigger: '.navbar-side-toggle'
    //        });
    //    }
    //
    //    function attachEvents(){
    //        //Sidebar toggle
    //        elems.$sidebarTrigger.click(function(){
    //            elems.$wrapper.toggleClass('navbar-hide');
    //            elems.$sidebar.children().fadeToggle();
    //        });
    //
    //        //Remove preloader on window load
    //        $(window).load(function(){
    //            elems.$preloader.fadeOut();
    //        });
    //    }
    //
    //    function getElem(elem){
    //        return elems[elem];
    //    }
    //
    //    function init(){
    //        findElements();
    //        attachEvents();
    //    }
    //
    //    //App API
    //    return {
    //        init:init,
    //        getElem:getElem
    //
    //    }
    //})();


    /**
     * Scale video and save it`s ratio
     */
    var videoScale = (function(){

        function findVideos(selective){
            var videoSelector = '.video-frame iframe';
            if(selective != 'all') videoSelector += ':not(.resized-frame)';
            return $(videoSelector);
        }

        function normalize(selective){
            var height, ratio,
                frameContainer, video,
                videos = findVideos(selective);

            videos.each(function(){
                video = $(this);
                frameContainer = video.parent();

                ratio = frameContainer.width() / video.attr('width');
                height = video.attr('height') * ratio;

                frameContainer.css('padding-bottom', height);
                video.addClass('resized-frame');

            });
        }

        function reNormalize(){
            normalize('all');
        }

        function init(){
            normalize();
            $(window).resize(reNormalize);
        }

        return {
            normalize:init
        }
    })();

    $(document).ready(function(){
        //App.init();
        videoScale.normalize();

    });




})(jQuery);

//
//$(window).load(function(){
//    $('.preloader').fadeOut();
//});
