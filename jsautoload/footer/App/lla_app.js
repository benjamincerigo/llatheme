var llaapp = angular.module('llaapp', [
	//'ui.router',
	'ui.router',
	'ngResource',
	'restangular',
	'llaapp.services'
 
]);

llaapp.config( function( $urlRouterProvider , $stateProvider ) {
	"use strict";

	// Default State
	$urlRouterProvider.otherwise("/");
	
	$stateProvider
		.state('home', {
			url: "/",
			template: '<p>hello</p>'
		});
	// Global catching of uiRouter errors (for development)
	/*$rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams,
			error){ 
		
		console.log( event, toState, toParams, fromState, fromParams, error );
	});*/
});
