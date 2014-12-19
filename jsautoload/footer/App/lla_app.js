
// Declare app level module which depends on views, and components
var llaapp = angular.module('llaapp', [
	'ui.router',
	'ngRoute',
	'ngResource',
	'restangular'
 
]);

llaapp.config(function($urlRouterProvide, $rootScope) {
	"use strict";

	 // Default State
	$urlRouterProvider.otherwise("section");
	
	// Global catching of uiRouter errors (for development)
	$rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams,
			error){ 
		"use strict";
		console.log( event, toState, toParams, fromState, fromParams, error );
	});
});
