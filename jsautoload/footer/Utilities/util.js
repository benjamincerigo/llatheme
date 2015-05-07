window.angular.module('llaapp.util', [
	'ui.router'])
.factory('_', function() {
	'use strict';
	  return window._; // assumes underscore has already been loaded on the page
})
.service('namespace', [ function(){
	'use strict';
	
	return function( o , s ){
		s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    s = s.replace(/^\./, '');           // strip a leading dot
    var a = s.split('.');
    while (a.length) {
        var n = a.shift();
        if (n in o) {
            o = o[n];
        } else {
					o[n] = {};
        }
    }
		return o;
	};
}])
.directive('scrollable', [function(){
	'use strict';
	return {
		link: function( scope , element , attr){
			var $ = window.jQuery,
					op = {},
					nice;
			op.cursorcolor = '#A4A4A4';
			op.cursorborder = '0';
			if(attr.scrollable === 'x'){
				op.cursorwidth = '8px';
				//op.cursorminheight = '20px';
				op.autohidemode = 'false';
			}
			nice = 	$(element).niceScroll(op);
		
			if(attr.scrollable === 'x'){
				// hack foR no veritcal scroll
				var _super = nice.getContentSize;
				nice.getContentSize = function() {      
					var page = _super.call(nice);
					page.h = nice.win.height();
					return page;
				};
				nice.railh.addClass('lla_scrollbar_hr');
				nice.railh.removeAttr('style');
			}
		}
	};
}])
.directive('llaanimate', ['whichAnimationEvents', function(whichAnimationEvents){
	'use strict';
	return{
		scope: {
			llaanimateon: '=',
			llaanimatein: '@',
			llaanimateout: '@',
		},
		restrict: 'A',
		link: function (scope, element, attr){
			var initialAnimate = false, 
				ani;
			// ani is the events that the animation will end
			ani = whichAnimationEvents.animationEvents;
			scope.$watch('llaanimateon', function(newValue, oldValue){
				if(newValue !==false && newValue !== 'undefined'){
					switch(newValue){
						case 'in':
							$(element).addClass(scope.llaanimatein);
							break;
						case 'out':
							$(element).addClass(scope.llaanimateout);
							break;
					}
					$(element).addClass('animated');
				}
			});
			// On the end of the animate clean up
			$(element).one(ani, function(event){
				var scroll = $(element).find('[scrollable]');
				// check for the scroll inside is so then will resize of the
				// animation complete
				if( scroll.length !== 0){
					scroll = $(element).find('[scrollable]');
					scroll.each(function(i,el){
						$(el).getNiceScroll().hide();
					});
				}
				$(this).removeClass('animated');
				$(this).removeClass(scope.llaanimatein);
				$(this).removeClass(scope.llaanimateout);
				scope.$apply(function(){
					scope.llaanimateon = false;
				});
				if(scroll.length !== 0){
					scroll.each(function(i, el){
						$(el).getNiceScroll().resize();
						$(el).getNiceScroll().show();
					});
				}
			});
		}
	};
}])
.directive('quotes', ['homepagemodel',function(homepagemodel){
	'use strict';
	return{
		link: function(scope, el, attr){
			switch(attr.quotes){
				case 'click':
				 el.bind('click', function() {
					 scope.$apply(function(){
						 homepagemodel.selectQuote();
					 });
				 });
				 break;
				case 'off':
				 el.bind('click', function() {
					 scope.$apply(function(){
						 homepagemodel.initHome();
					 });
				 });
				 break;
				case 'waypointchange':
				var waypoint = new Waypoint({
					  element: el,
					  handler: function(direction) {
							 scope.$apply(function(){
									 homepagemodel.selectQuote();
							 });
						},
					  horizontal: true
				})
				 break;
			}
		 },
		restrict: 'A',
	};
}])
.directive('galleryway', ['$state', function($state){
	'use strict';
	return{
		link: function(scope, el, attr){
			var type = attr.galleryway;
			switch(type){
			case ('waypoint'):
				var waypoint = new Waypoint({
					  element: el,
					  handler: function(direction) {
							 scope.$apply(function(){
								 var id = $(el).attr('id');
								 scope.curId = id;
							 });
						},
					  horizontal: true
				})
				break;
			case ('next'):
				el.bind('click', function(){
					if( scope.curId !== 'undefined' && scope.curId !== false){
						var next = $('#' + scope.curId).next();
					}else{
						var next = $('.gallery').children()[0]; 
					}
					next = $(next).attr('id');
					$state.go('sense.gallery', {picture: next});
					scope.curId = next;
				});
				break;
			case ('null'):
				 el.bind('click', function() {
					var jQ = window.jQuery;
					scope.curId = false;
					//jQ('html,body').animate({scrollLeft: 0}, 800);
					$state.go('sense.gallery', {picture: ''});
				 });
				 break;
			case ('nullwaypoint'):
				var waypoint = new Waypoint({
					  element: el,
					  handler: function(direction) {
							scope.curId = false; 
						},
					  horizontal: true
				})
				 break;
			}
		 },
		restrict: 'A',
	};
}])
;
