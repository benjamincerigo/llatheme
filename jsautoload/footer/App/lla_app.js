var llaapp = window.angular.module('llaapp', [
	//'ui.router',
	'ui.router',
	'ngResource',
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
llaapp.run([  '$rootScope', '$state', '$stateParams',
		function ($rootScope, $state, $stateParams ) {
			"use strict";
			$rootScope.$state = $state;
			$rootScope.$stateParams = $stateParams;
	    $rootScope.$on('$stateChangeSuccess',
		  	function(event, toState, toParams, fromState, fromParams){
			   //console.log(toState);
				 //console.log(toParams);
				 //console.log(fromState);
				 //console.log(fromParams);
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
		.state('gallery', {
			url: '/gallery/{part}',
			resolve: {
				galleryRes: ['galleryPageModel',function(galleryPageModel){
					return galleryPageModel.promise;
				}],
				hi: function(){
					console.log('resolve');
					return 'hi';
				}
			},
			onEnter: ['partOb', '$stateParams', '$rootScope' , 'moveOnUrl', 'homepagemodel',function(partOb, $stateParams, $rootScope, moveOnUrl, homepagemodel){
				var jQ = window.jQuery,
						section =  $stateParams.section; 
				console.log('glalery');
			}],
			templateUrl: lla_wpProvider.t +  '/inc/html/gallery_page.html',
			controller: ['$scope',  'hi', 'galleryRes',   function($scope,  hi, galleryRes){
				console.log(hi);
				console.log('controller');
				console.log(galleryRes);
			}]
		})
		.state('homepage.stuff', {
			url: '/{section}/{part}',
			onEnter: ['partOb', '$stateParams', '$rootScope' , 'moveOnUrl', 'homepagemodel',function(partOb, $stateParams, $rootScope, moveOnUrl, homepagemodel){
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
					controller: ['$scope',  'homepagemodel', function( $scope , homepagemodel){
						$scope.model = homepagemodel.getSection('home');
						$scope.line_img_url = $scope.template_dir + '/img/LLA_LineFull4000.jpg';
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
			onEnter: ['partOb', '$stateParams', '$rootScope' , 'moveOnUrl', 'homepagemodel',function(partOb, $stateParams, $rootScope, moveOnUrl, homepagemodel){
				var jQ = window.jQuery;
				homepagemodel.state($stateParams);
			}],
		});
}]);
