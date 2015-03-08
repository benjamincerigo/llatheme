var llaapp = window.angular.module('llaapp', [
	//'ui.router',
	'ui.router',
	'ngResource',
	'restangular',
	'llaapp.services',
	'llaapp.home',
	'llaapp.about',
	'llaapp.calender',
	'llaapp.util',
	'llaapp.inlineservices'
 
]);
llaapp.run([  '$rootScope', '$state', '$stateParams',
		function ($rootScope, $state, $stateParams ) {
			"use strict";
			$rootScope.$state = $state;
			$rootScope.$stateParams = $stateParams;
	    $rootScope.$on('$stateChangeSuccess',
		  	function(event, toState, toParams, fromState, fromParams){
			   console.log(toState);
				 console.log(toParams);
				 console.log(fromState);
				 console.log(fromParams);
		   });
		}
		]
		);
// Provider for the template directory. 
llaapp.config( ['$urlRouterProvider', '$stateProvider', '$urlMatcherFactoryProvider', 'lla_wpProvider', 'homepagemodelProvider',
	function( $urlRouterProvider , $stateProvider, $urlMatcherFactoryProvider, lla_wpProvider, homepagemodelProvider) {
	"use strict";
	homepagemodelProvider.init();
	console.log(homepagemodelProvider);
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
		.state('homepage.stuff', {
			url: '/{section}/{part}',
			onEnter: ['partOb', '$stateParams', '$rootScope' , 'moveOnUrl', 'homepagemodel',function(partOb, $stateParams, $rootScope, moveOnUrl, homepagemodel){
				var jQ = window.jQuery,
						section =  $stateParams.section; 
				console.log('home model');
				console.log(homepagemodel);
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
						console.log(homepagemodel.getSection('home'));
						$scope.model = homepagemodel.getSection('home');
						$scope.line_img_url = $scope.template_dir + '/img/LLA_LineFull4000.jpg';
					}],
				},
				'about':{ templateUrl: lla_wpProvider.t + '/inc/html/about.html', 
					controller: ['$scope',  'homepagemodel', function( $scope , homepagemodel){ 
						console.log('aboutloaded');
						$scope.model = homepagemodel.getSection('about');
					}],
				},
				'calender': {templateUrl: lla_wpProvider.t + '/inc/html/calender.html', 
					controller: ['$scope',  'homepagemodel', function( $scope , homepagemodel){ 
						console.log('calenderLoaded');
						$scope.model = homepagemodel.getSection('calender');
						console.log($scope);
					}],
				},
				'contact':{ templateUrl: lla_wpProvider.t + '/inc/html/contact.html', 
					controller: ['$scope',  'homepagemodel', function( $scope , homepagemodel){ 
						console.log('calenderLoaded');
						$scope.model = homepagemodel.getSection('contact');
					}],
				}
			},
			
		});
}]);
