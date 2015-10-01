angular.module('llaapp.services', [
        'ui.router',
        'llaapp.util'
])
.service('TopNavFactory', function(){
    'use strict'
        var getModel  = function(name){
            var model;
            switch(name){
                case 'home':
                    model = [
                    {
                        'title': 'home',
                        'slug': 'home/',
                    },
                    {
                        'title': 'about',
                        'slug': 'about/',
                    },
                        {
                            'title': 'calender',
                            'slug': 'calender/',
                        },
                        {
                            'title': 'contact',
                            'slug': 'contact/',
                        }
                    ];
                    break;
            }
            return model;	
        };
    return{
        get: getModel
    };

})
.service('moveOnUrl', [ function(){
    'use strict';
    var execute = function($stateParams){
        var jQ = window.jQuery,
        section =  $stateParams.section, 
        offset = 0;
        if(section === '~'){
            section = 'home';
        }
        offset = jQ('#'+ section).offset().left - 50; 
        jQ('html,body').animate({scrollLeft: offset}, 800);
    };
    return {
        'execute': execute
    };
}])
.service('moveOnUrlGallery', ['galleryCurId', function(galleryCurId){
    'use strict';
    var execute = function($stateParams){
        var jQ = window.jQuery,
        picture =  $stateParams.picture, 
        offset = 0;
        console.log($stateParams);
        galleryCurId.motion = true;
        if( !(picture) || jQ('#'+picture).length === 0 ){
            galleryCurId.curId = false;
            offset = 0;	
        } else {
            galleryCurId.curId = picture;
            offset = jQ('#'+ picture).offset().left; 
        }
        jQ('html,body').animate({scrollLeft: offset},{duration: 800, complete: function(){ console.log('finshedmove');galleryCurId.motion = false;}});
        console.log(galleryCurId);
    };
    return {
        'execute': execute
    };
}])
.service('csscheck', function(){
    var docheck;
    docheck = function(state){
        var totalwidth = 0;
        switch(state){
            case 'gallery':
                jQuery('body').removeClass('homewidth');
                jQuery('.galleryimg').each(function() {
                    totalwidth += jQuery(this).width(); 
                });
                break;
            case 'home':
                jQuery('body').addClass('homewidth');
                break;
        }
    };
    return {
        'docheck':docheck
    };
}) 
.service('whichAnimationEvents', function(){
    var ani,
    reinit;

    reinit = function whichAnimationEvent(){
        var t,
        el = document.createElement("fakeelement");

        var animations = {
            "animation"      : "animationend",
            "OAnimation"     : "oAnimationEnd",
            "MozAnimation"   : "animationend",
            "WebkitAnimation": "webkitAnimationEnd"
        }

        for (t in animations){
            if (el.style[t] !== undefined){
                if(typeof this.animationEvents !== undefined){
                    this.animationEvents =  animations[t];
                }
                return animations[t]
            }
        }
    };
    ani = reinit();
    return {
        animationEvents: ani,
        reInit: reinit
    };
})
.service('galleryLoadResolve',['$q','$rootScope','moveOnUrlGallery',  function($q, $rootScope, moveOnUrl){
    return {
        init: function(){
            var def = $q.defer();
            $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState){
                if(fromState.url === '^' || fromState.name === 'homepage.stuff'){ 
                    def.resolve(fromState);
                } else {
                    def.reject(fromState);
                }
            });
            return def.promise;
        },
        load: function( $stateParams){
            var def = $q.defer(); 
            this.init().then(function(fromState){
                $rootScope.$on('$llagalleryLoadComplete', function(event){
                    def.resolve();
                });
            });
            return def.promise;
        }

    };
}])
;
