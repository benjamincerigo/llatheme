var llaapp = angular.module('llaapp', [
	//'ui.router',
	'ui.router',
	'ngResource',
	'restangular',
	'llaapp.services'
 
]);

// Provider for the template directory. 
llaapp.config( function( $urlRouterProvider , $stateProvider) {
	"use strict";

	// Default State
	$urlRouterProvider.otherwise("/");
	
	$stateProvider
		.state('homepage', {
			url: "/",
			
			resolve: {
				intialmodel: function( InitialModel ){
					console.log(InitialModel);
					return InitialModel.InitialModel;
				}
			},
			

			views: {
				'home': {
					templateUrl: 'http://lifelinearts.local/wp-content/themes/lla/inc/html/home.html', 
					controller: function( $scope , intialmodel ){
						console.log(intialmodel);
						$scope.home = intialmodel.content[0];
						console.log($scope);
					}
				},
				'about':{ templateUrl: 'http://lifelinearts.local/wp-content/themes/lla/inc/html/about.html', 
					controller: function( $scope , intialmodel ){
						console.log(intialmodel);
						$scope.home = intialmodel.content[1];
						console.log($scope);
					}},
				'calender': {templateUrl: 'http://lifelinearts.local/wp-content/themes/lla/inc/html/calender.html', 
					controller: function( $scope , intialmodel ){
						console.log(intialmodel);
						$scope.home = intialmodel.content[2];
						console.log($scope);
					}},
				'contact':{ templateUrl: 'http://lifelinearts.local/wp-content/themes/lla/inc/html/contact.html', 
					controller: function( $scope , intialmodel ){
						console.log(intialmodel);
						$scope.home = intialmodel.content[3];
						console.log($scope);
					}}
			}

		});
		
	// Global catching of uiRouter errors (for development)
	/*$rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams,
			error){ 
		
		console.log( event, toState, toParams, fromState, fromParams, error );
	});*/
});
