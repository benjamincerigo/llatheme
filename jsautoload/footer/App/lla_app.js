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
					controller: ['$scope',  'homepagemodel','lla_wp', function( $scope , homepagemodel, lla_wp){
						$scope.model = homepagemodel.getSection('home');
						$scope.model.blog_title = lla_wp.blog_title;
						$scope.model.sense = lla_wp.sense;
					}],
				},
				'about':{ templateUrl: lla_wpProvider.t + '/inc/html/about.html', 
					controller: ['$scope',  'homepagemodel', function( $scope , homepagemodel){ 
						$scope.model = homepagemodel.getSection('about');
					}],
				},
				'calender': {templateUrl: lla_wpProvider.t + '/inc/html/calender.html', 
					controller: ['$scope',  'homepagemodel', function( $scope , homepagemodel){ 
						$scope.model = homepagemodel.getSection('calender');
					}],
				},
				'contact':{ templateUrl: lla_wpProvider.t + '/inc/html/contact.html', 
					controller: ['$scope',  'homepagemodel', function( $scope , homepagemodel){ 
						$scope.model = homepagemodel.getSection('contact');
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
