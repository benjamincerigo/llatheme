window.angular.module('llaapp.about', ['llaapp.util']);

window.angular.module('llaapp.calender', ['llaapp.util'])
.directive('sectionSelectCal', ['partOb', function(partOb ){
	'use strict';
	function link(scope, element, attr) {
		var	callback = {}, 
			id = parseInt(attr.sectionSelectCal);
 
		console.log('loaded the thing');
		console.log(id);
		callback.scope = scope;
		callback.element = element;
		callback.attr = attr;
		callback.selectIndex = id;
		if(id === 0){
			if( !scope.$parent.selected.hasOwnProperty('init') ){
				scope.$parent.selected.init = scope;
			}
			if( !scope.$parent.model.content.main.hasOwnProperty('anevent') ){
				scope.$parent.model.content.main = scope.anevent;
				scope.$parent.selected.last = scope;
			}
			if(!scope.anevent.hasOwnProperty('selected')){
				scope.anevent.selectedbool= true;
			}
		}
			
		if( id >= 0 ){
			callback.callback = function(  ){
				var par = this.scope.$parent;
				console.log(this.selectIndex);
				if(!par.selected.last){
					par.selected.last.anevent.selectedbool = false;	
				}
				if(this.selectIndex !== 0 ){
				par.selected.last = this.scope;
				} else {
					par.selected.last = false;
				}
				this.scope.anevent.selected = true;
				par.model.content.main = this.scope.anevent;
			};
			partOb.subscribe('calender', scope.anevent.lla_part_slug , callback);
		}else if( id < 0 ){
			callback.callback = function(  ){
				console.log('called callback 2');
				console.log(this.selectIndex);
				if(this.scope.selected.hasOwnProperty('last') && !this.scope.selected.last){
						this.scope.selected.last.anevent.selectedbool = false;	
				}
				if(this.scope.selected.hasOwnProperty('init')){
					this.scope.selected.init.anevent.selectedbool = true;
					this.scope.model.content.main = this.scope.selected.init.anevent; 
				}
				this.scope.selected.last  = false;
			};
			partOb.subscribe('calender', '~', callback);
		}
	}
	return {
		restrict: 'A',
		link: link
	};

}]);

window.angular.module('llaapp.contact', [
	'reCAPTCHA',
	'llaapp.inlineservices',
])
.directive('contactFormProcess',  function(){
	'use strict';
	return {
		restrict: 'A',
		controller: ['$scope', 'lla_wp', 'reCAPTCHA' , function($scope, lla_wp, reCAPTCHA){
				var re = lla_wp.recaptchakey; 
				$scope.mail  = {};
				reCAPTCHA.setPublicKey(re);
				$scope.mailrequest = {};
				$scope.mailrequest.showdialog = false;
				$scope.mailrequest.success = false;
				$scope.mailrequest.fail = false;
				$scope.mailrequest.loading = false;
				$scope.mailrequest.errors = {};

				$scope.submitMail= function () {
					var formData;
					if($scope.registerForm.$valid) {
						$scope.mailrequest.returnmessage = 'Your request is being process';
						$scope.mailrequest.loading = true;
						$scope.mailrequest.showdialog = true;	
						$scope.mailrequest.fail = false;
						$scope.mailrequest.success = false;
						formData = (
								{	action:'lla_simple_mail',
									nouce:lla_wp.nouce,
									'g-recaptcha-response':$scope.mail.captcha,
								'lla_contact_name':$scope.mail.name,
								'lla_contact_email':$scope.mail.email,
								'lla_contact_message':$scope.mail.message
								});
						//Make Query
						window.jQuery.ajax({
							type: 'POST',
							url: lla_wp.ajax,
							data: formData,
							dataType: 'json'
						}).fail(function(response){
							$scope.$apply(function(){
								$scope.mailrequest.showdialog = true;
								$scope.mailrequest.loading = false;
								$scope.mailrequest.fail = true;
								$scope.mailrequest.errors = response.responseJSON.errors;
								reCAPTCHA.reload();
							});
						}).done(function(response){
							$scope.$apply(function(){
								$scope.mailrequest.showdialog = true;
								$scope.mailrequest.loading = false;
								$scope.mailrequest.returnmessage = response.message;
								$scope.mailrequest.success = true;
								$scope.mail.captcha = '';
								$scope.mail.email = '';
								$scope.mail.message = '';
								$scope.mail.name = '';
								reCAPTCHA.reload();
								$scope.registerForm.$setPristine();
							});
						});
					}
				};
		}]
	};
});



window.angular.module('llaapp.gallery', [
	'llaapp.inlineservices',
])
.provider('galleryPageModel',['lla_wpProvider','$qProvider','$rootScopeProvider', function(lla_wpProvider, $q, $scope){
	'use strict';
	this.hi = function(){
		return 'hi';
	};
	this.getSection = function(section){
		var r;
		switch(section){
			default:
				r = this.model;
				break;
		}
		return r;
	};
	this.processState = function($stateParams){
		var s = this.lla_search($stateParams, 'picture'),
			p = this.lla_search($stateParams, 'extra'),
			a = this.model;
		if(s){
			s = this.lla_search_slug(a.content.posts, s);
			if(p === 'full'){
				s.animate = 'in';
				s.selectedbool = true;
			}else{
				s.selectedbool = false;
			}
		}
	};
	this.lla_search = function(o, find){
		if(typeof o === 'undefined' || o === null ){
			return false;
		}
		if(o.hasOwnProperty(find)){
			return o[find];	
		}else{
			return false;
		}
	};
	this.lla_search_slug = function(o, find){
		var r = false,
			key;
		for (key in o) {
			var p = o[key];
			r =this.lla_search(p, 'lla_part_slug');
			if( r === find ){
				r = p;
			} else {
				r = false;
			}
			if( r !== false ){
				break;
			}
		}
		return r;
	};
	this.$get = ['$q',function ($q){
		var deferred = $q.defer(),
			r = {
				getSection: this.getSection,
				state: this.processState,
				lla_search: this.lla_search,
				lla_search_slug: this.lla_search_slug,
			}, 
			getData;
		getData = (
				{	action:'lla_get_gallery',
					nouce:lla_wpProvider.n
				}
				);
			window.jQuery.ajax({
				type: 'POST',
				url: lla_wpProvider.a,
				data: getData,
				dataType: 'json'
			}).fail(function(response){
				console.log(response);
				console.log(response.responseText);
				r.fail = {};
				r.fail.message = response.message;
				deferred.resolve(r);
			}).done(function(response){
				console.log('done');
				console.log(response);
				r.model = response;
				deferred.resolve(r);
			});
		return deferred;
	}];
}])
.service('galleryCurId', function(){
	var curId = false;
	return {
		curId: curId
	};
});

window.angular.module('llaapp.home', [	'llaapp.inlineservices'])
/*.directive('quotes', [ '$interval', function($interval){
	'use strict';
	

	function link(scope, element, attrs) {
	//	var i;
	}
	return {
		restrict: 'AC',
		link: link
	};
}])*/
.provider('homepagemodel', function(InitialModelProvider){
	'use strict';
	if(!this.hasOwnProperty('model')){
		var i =  InitialModelProvider.$get();
		this.model = i.InitialModel;
	}
	this.init = function(){
		this.initHome();
		this.initAbout();
		this.initCalender();
		this.initContact();
	};
	this.initHome = function(){
		var h = this.getSection('home');
		h.quote = false;
	};
	this.selectQuote = function(){
		var h = this.getSection('home'),
			quotes = h.content.Home.content.quotes,
			len = quotes.length - 1,
			ran = Math.floor((Math.random() * len) + 1); 
			h.quote = quotes[ran];
	};
	this.toggleQuote = function(){
		var h = this.getSection('home');
		if( h.quote === false ){
			this.selectQuote();
		} else {
			this.initHome();	
		}
	}
	this.initAbout = function(){
		var a = this.getSection('about'),
				s = this.lla_search(a.content, 'main');
		if(s === false){
			a.content.main = {};
		}
		a.content.main.selectedbool = false;
	};
	this.initCalender = function(){
		var m = this.model.content.Calender,
			k = Object.keys(m.content.events)[0] ,
			i = m.content.events[k];
		m.fullbool = false;
		this.deselectAll(m.content.events);
		m.content.main = i;
		i.selectedbool = true;
	};
	this.initContact = function (){

	};
	this.getSection = function(section){
		var r;
		switch(section){
			case ('home'):
				r =  this.model;
				break;
			case ('about'):
				r = this.model.content.About;
				break;
			case ('calender'):
				r = this.model.content.Calender;
				break;
			case ('contact'):
				r = this.model.content.Contact;
				break;
		}
		return r;
	};
	this.lla_search = function(o, find){
		if(o.hasOwnProperty(find)){
			return o[find];	
		}else{
			return false;
		}
	};
	this.processState = function($stateParams){
		var s = this.lla_search($stateParams, 'section'),
			p = this.lla_search($stateParams, 'part'),
			f = this.lla_search($stateParams, 'extra');

		if( p === false){
			return null;
		}
		switch(s){
			case 'about':
				this.aboutState(this.getSection('about'), p, f);
				break;
			case 'calender':
				this.calenderState(this.getSection('calender'), p, f);
				break;
			default:
				return null;
		}
	};
	this.aboutState = function(a,p,f){
		var s;
		if( p === '~' ){
			this.initAbout();
		}else{
			s = this.lla_search(a.content.posts, p);
			if(s === false){
				return null;
			}
			a.content.main.selectedbool = false;
			this.deselectAll(a.content.posts);
			s.selectedbool = true;
			a.content.main = s;
			a.content.main.animate = 'in';
			a.content.main.selectedbool = true;
		}
	};
	this.calenderState = function(c,p,f){
		var s;
		if( p === '~' ){
			this.initCalender();
		}else if(f === 'full'){
			c.animate = 'in';
			c.fullbool = true;
		}else{
			c.fullbool = false;
			s = this.lla_search(c.content.events, p);
			if(s === false){
				return null;
			}
			c.content.main.selectedbool = false;
			this.deselectAll(c.content.events);
			s.selectedbool = true;
			c.content.main = s;
		}
	};
	this.deselectAll = function(ob){
		Object.keys(ob).forEach(function(key ) {
			this[key].selectedbool = false;
			this[key].animate = 'out';
		}, ob);
	};
	this.$get = function (){
		var r = {
			model: this.model,
			getSection: this.getSection,
			state: this.processState,
			lla_search: this.lla_search,
			initHome: this.initHome,
			initAbout: this.initAbout,
			aboutState: this.aboutState,
			initCalender: this.initCalender,
			calenderState: this.calenderState,
				//Quotes
			selectQuote: this.selectQuote,
			toggleQuote: this.toggleQuote,
				//Utils
			deselectAll: this.deselectAll,

		};
		return r;
	};
});

var llaapp = window.angular.module('llaapp', [
	//'ui.router',
	'ui.router',
	'ngResource',
	'ngSanitize',
	'reCAPTCHA',
	'llaapp.services',
	'llaapp.home',
	'llaapp.about',
	'llaapp.calender',
	'llaapp.util',
	'llaapp.inlineservices',
	'llaapp.contact',
	'llaapp.gallery',
]);
llaapp.run([  '$rootScope', '$state', '$stateParams','csscheck',
		function ($rootScope, $state, $stateParams , csscheck) {
			"use strict";
			$rootScope.$state = $state;
			$rootScope.$stateParams = $stateParams;
	    $rootScope.$on('$stateChangeSuccess',
		  	function(event, toState, toParams, fromState, fromParams){
			   //console.log(toState);
				 //console.log(toParams);
				 //console.log(fromState);
				 //console.log(fromParams);
				csscheck.docheck('gallery');
		   });
		}
		]
		);
// Provider for the template directory. 
llaapp.config( ['$urlRouterProvider', '$stateProvider', '$urlMatcherFactoryProvider', 'lla_wpProvider', 'homepagemodelProvider', 'reCAPTCHAProvider',
	function( $urlRouterProvider , $stateProvider, $urlMatcherFactoryProvider, lla_wpProvider, homepagemodelProvider, reCAPTCHAProvider) {
	"use strict";
	var re = lla_wpProvider.r;
	homepagemodelProvider.init();
	//reCaptcap
	reCAPTCHAProvider.setPublicKey(re);
	reCAPTCHAProvider.setOptions({
			theme: 'clean'
	});
	var topnavState = { 
			templateUrl: lla_wpProvider.t + '/inc/html/topnav.html', 
			controller: ['$scope', 'TopNavFactory', function($scope, TopNavFactory){
				$scope.model = {};
				$scope.model.menuItems = TopNavFactory.get('home');
			}]
		};
	$urlRouterProvider.otherwise("/~/");
	$stateProvider
		.state('homepage', {
			abstract: true,
			templateUrl: lla_wpProvider.t +  '/inc/html/home_page.html',
			controller: [ '$scope', 'lla_wp', '$rootScope',  function( $scope , lla_wp, $rootScope){
				$scope.template_dir = lla_wp.template_dir;
				$rootScope.homeLoaded = true;
			}]
		})
		.state('sense', {
			url: '/sense',
			templateUrl: lla_wpProvider.t +  '/inc/html/sense.html',
			controller: ['$scope',   'lla_wp', function($scope,   lla_wp ){
				$scope.model = {};
				$scope.model.sense = lla_wp.sense;
			}]
		})
		.state('sense.gallery', {
			url: '/gallery/{picture}',
			resolve: {
				galleryRes: ['galleryPageModel',function(galleryPageModel){
					return galleryPageModel.promise;
				}],
			},
			onEnter: ['$rootScope', '$stateParams', 'moveOnUrlGallery', 'galleryRes', 'galleryLoadResolve', function($rootScope, $stateParams, moveOnUrl, galleryPageModel, galleryLoadResolve){
				var jQ = window.jQuery,
					picture =  $stateParams.picture || 'sense'; 
				galleryPageModel.state($stateParams);
				if(jQ('#' + picture).length === 0){
					galleryLoadResolve.load().then(function(){
						console.log('triple retrun');
						$('[scrollable]').getNiceScroll().resize();
						$rootScope.$broadcast('$llagalleryLoadedImages');
						moveOnUrl.execute($stateParams);
					});
				}else{
					console.log('else from ');
					moveOnUrl.execute($stateParams);
				}
			}],
			templateUrl: lla_wpProvider.t +  '/inc/html/gallery_page.html',
			controller: ['$scope',   'galleryRes', 'csscheck', function($scope,   galleryRes, csscheck){
				$scope.model = galleryRes.getSection('main');
				csscheck.docheck('gallery');
			}]
		})
		.state('sense.gallery.extra', {
			url: '/{extra}',
			onEnter: [ '$stateParams',  'galleryRes',function( $stateParams, gallerypageModel){
				gallerypageModel.state($stateParams);
			}],
		})
		.state('homepage.stuff', {
			url: '/{section}/{part}',
			onEnter: ['$stateParams', '$rootScope' , 'moveOnUrl', 'homepagemodel',function($stateParams, $rootScope, moveOnUrl, homepagemodel){
				var jQ = window.jQuery,
						section =  $stateParams.section; 
				homepagemodel.state($stateParams);
				if(section === '~'){
					section = 'home';
				}
				if(jQ('#' + section).length === 0){
					$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState){
							if(fromState.url === '^'){ 
								moveOnUrl.execute(toParams);
							}
						}
					);
				}else{
					moveOnUrl.execute($stateParams);
				}
			}],
			views: {
			'topnav': topnavState,
				'home': {
					templateUrl: lla_wpProvider.t + '/inc/html/home.html', 
					controller: ['$scope',  'homepagemodel','lla_wp', '$sce', function( $scope , homepagemodel, lla_wp, $sce){
						$scope.model = homepagemodel.getSection('home');
						$scope.model.blog_title = lla_wp.blog_title;
						$scope.model.sense = lla_wp.sense;
						$scope.trustAsHtml = function(string) {
							if(string === false){
								string = '';
							}
							return $sce.trustAsHtml(string);
						};
					}],
				},
				'about':{ templateUrl: lla_wpProvider.t + '/inc/html/about.html', 
					controller: ['$scope',  'homepagemodel', '$sce' ,function( $scope , homepagemodel, $sce){ 
						$scope.model = homepagemodel.getSection('about');
						$scope.trustAsHtml = function(string) {
							    return $sce.trustAsHtml(string);
						};
					}],
				},
				'calender': {templateUrl: lla_wpProvider.t + '/inc/html/calender.html', 
					controller: ['$scope',  'homepagemodel', '$sce', function( $scope , homepagemodel, $sce){ 
						$scope.model = homepagemodel.getSection('calender');
						$scope.trustAsHtml = function(string) {
							    return $sce.trustAsHtml(string);
						};
					}],
				},
				'contact':{ templateUrl: lla_wpProvider.t + '/inc/html/contact.html', 
					controller: ['$scope',  'homepagemodel', '$sce',  function( $scope , homepagemodel, $sce){ 
						$scope.model = homepagemodel.getSection('contact');
						$scope.trustAsHtml = function(string) {
							    return $sce.trustAsHtml(string);
						};
					}],
				}
			},
			
		})
		.state('homepage.stuff.extra', {
			url: '/{extra}',
			onEnter: ['$stateParams', '$rootScope' , 'moveOnUrl', 'homepagemodel',function($stateParams, $rootScope, moveOnUrl, homepagemodel){
				var jQ = window.jQuery;
				homepagemodel.state($stateParams);
			}],
		});
}]);

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
						console.log(fromState);
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

// Namespace function
//
//

llaapp.namespace = function(ns) {
	"use strict";
	var parts = ns.split("."),
		object = this,
		i, len;

	for (i=0, len=parts.length; i < len; i++) {
		if (!object[parts[i]]) {
			object[parts[i]] = {};
		}
		object = object[parts[i]];
	}
	return object;
};


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
				case 'toggle':
				 el.bind('click', function() {
					 scope.$apply(function(){
						 homepagemodel.toggleQuote();
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
.directive('galleryway', ['$state', 'galleryCurId', function($state, galleryCurId, galleryLoadResolve){
	'use strict';
	console.log(galleryCurId);
	return{
		link: function(scope, el, attr){
			var type = attr.galleryway;
			switch(type){
			case ('waypoint'):
			scope.$on('$llagalleryLoadedImages', function(){
					var waypoint = new Waypoint({
						  element: el,
						  handler: function(direction) {
								 var id = $(el).attr('id');
								 console.log(galleryCurId);
								 if(galleryCurId.motion !== true){
								 galleryCurId.curId = id;
								 console.log(galleryCurId);
								  }
							},
						  horizontal: true
					})
				});
				break;
			case ('next'):
				console.log('nextbind');
				console.log(el);
			scope.$on('$llagalleryLoadedImages', function(){
				console.log('nextbind');
				console.log(el);
				el.bind('click', function(){
					var picturetest = false;
					console.log('click');
					console.log(galleryCurId);
					if( galleryCurId.curId !== 'undefined' && galleryCurId.curId !== false){
						var next = $('#' + galleryCurId.curId).next();
					}else{
						var next = $('.gallery').children()[0]; 
					}
					picturetest = $(next).attr('galleryway');
					console.log(picturetest);
					if(picturetest){
						next = $(next).attr('id');
						console.log(next);
						$state.go('sense.gallery', {picture: next});
						galleryCurId.curId = next;
					}
				});
			});
				break;
			case ('null'):
				 el.bind('click', function() {
					var jQ = window.jQuery;
					galleryCurId.curId = false;
					//jQ('html,body').animate({scrollLeft: 0}, 800);
					$state.go('sense.gallery', {picture: ''});
				 });
				 break;
			case ('nullwaypoint'):
				var waypoint = new Waypoint({
					  element: el,
					  handler: function(direction) {
							galleryCurId.curId = false; 
						},
					  horizontal: true
				})
				 break;
			}
		 },
		restrict: 'A',
	};
}])
.directive('loadedimages', ['$rootScope',  function($rootScope){
	'use strict';
	var imgwait = {}, 
		addFun;
	addFun = function( key, value ){
		if(!key){
			return false;
		}
		imgwait[key] = value;
	}
	return{
		link: function(scope, el, attr){
			addFun(attr.ngSrc, false);
			el.bind('load', function(){
				var complete = true;
				addFun(attr.ngSrc, true);
				var keys = Object.keys(imgwait);
				for (var i = 0; i < keys.length; i++) {
					var val = imgwait[keys[i]];
					if( val === false){
						complete = false;
					}
					// else the complete will be true
				 }
				if( complete === true ){
					scope.$emit('$llagalleryLoadComplete', imgwait); 
				}
			});
		}
	};
}])
;
