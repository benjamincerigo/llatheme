var llaapp = window.angular.module('llaapp', [
	//'ui.router',
	'ui.router',
	'ngResource',
	'restangular',
	'llaapp.services',
	'llaapp.home',
	'llaapp.about',
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
llaapp.config( ['$urlRouterProvider', '$stateProvider', '$urlMatcherFactoryProvider', 'lla_wpProvider',
	function( $urlRouterProvider , $stateProvider, $urlMatcherFactoryProvider, lla_wpProvider) {
	"use strict";
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
			resolve: {
				intialmodel: function( InitialModel ){
					return InitialModel.InitialModel;
				}
			},
			onEnter: ['partOb', '$stateParams', '$rootScope' , 'moveOnUrl', function(partOb, $stateParams, $rootScope, moveOnUrl){
				var jQ = window.jQuery,
						section =  $stateParams.section; 
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
					controller: function( $scope , intialmodel ){
						$scope.model = intialmodel;
						$scope.line_img_url = $scope.template_dir + '/img/LLA_LineFull4000.jpg';
					},
				},
				'about':{ templateUrl: lla_wpProvider.t + '/inc/html/about.html', 
					controller: function( $scope , intialmodel ){
						$scope.model = intialmodel.content[1];
						$scope.model.content.mainbool = false;
						$scope.model.content.main = {};
					}},
				'calender': {templateUrl: lla_wpProvider.t + '/inc/html/calender.html', 
					controller: function( $scope , intialmodel ){
						$scope.model = intialmodel.content[2];
					}},
				'contact':{ templateUrl: lla_wpProvider.t + '/inc/html/contact.html', 
					controller: function( $scope , intialmodel ){
						$scope.model = intialmodel.content[3];
					}}
			},
			
		});
}]);
