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
.service('moveOnUrlGallery', [ function(){
	'use strict';
	var execute = function($stateParams){
		var jQ = window.jQuery,
				picture =  $stateParams.picture, 
				offset = 0;
		if(jQ('#'+picture).length === 0 || !(picture)){
			offset = 0;	
		} else {
			offset = jQ('#'+ picture).offset().left - 50; 
		}
		jQ('html,body').animate({scrollLeft: offset}, 800);
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
});
