var llaapp = angular.module('llaapp', [
	//'ui.router',
	'ui.router',
	'ngResource',
	'restangular',
	'llaapp.services',
	'llaapp.home',
	'llaapp.about'
 
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
					controller: function( $scope , intialmodel , lla_wp){
						
						$scope.model = intialmodel;
						$scope.line_img_url = $scope.template_dir + '/img/LLA_LineFull4000.jpg'
						
					}
				},
				'about':{ templateUrl: 'http://lifelinearts.local/wp-content/themes/lla/inc/html/about.html', 
					controller: function( $scope , intialmodel ){
						
						$scope.model = intialmodel.content[1];
						
					}},
				'calender': {templateUrl: 'http://lifelinearts.local/wp-content/themes/lla/inc/html/calender.html', 
					controller: function( $scope , intialmodel ){
						
						$scope.model = intialmodel.content[2];
						
					}},
				'contact':{ templateUrl: 'http://lifelinearts.local/wp-content/themes/lla/inc/html/contact.html', 
					controller: function( $scope , intialmodel ){
						$scope.model = intialmodel.content[3];
						
					}}
			}

		});
		
	// Global catching of uiRouter errors (for development)
	/*$rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams,
			error){ 
		
		console.log( event, toState, toParams, fromState, fromParams, error );
	});*/
})
.controller( 'MainController', [ '$scope', 'lla_wp', function( $scope , lla_wp){
	'use strict';
	$scope.template_dir = lla_wp.template_dir;
	
	console.log($scope);
}]);
