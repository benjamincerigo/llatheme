var llaapp = angular.module('llaapp', [
	//'ui.router',
	'ui.router',
	'ngResource',
	'restangular',
	'llaapp.services',
	'llaapp.home',
	'llaapp.about',
	'llaapp.util'
 
]);
llaapp.run([  '$rootScope', '$state', '$stateParams',
		function ($rootScope, $state, $stateParams ) {
			"use strict";
			//var ur = new UrlMatcher('/_home/{id}').exec($state.$current.url.source);
			//
			$rootScope.$state = $state;
			$rootScope.$stateParams = $stateParams;
	    $rootScope.$on('$routeChangeStart',
		  	function(event, toState, toParams, fromState, fromParams){
			  	event.preventDefault();
					console.log('From run');
			/*  	console.log(event);
			    console.log(toState);
			    console.log(toParams);
			    console.log(fromState);*/
		   });


		}
		]
		);
// Provider for the template directory. 
llaapp.config( ['$urlRouterProvider', '$stateProvider', '$urlMatcherFactoryProvider', 
	function( $urlRouterProvider , $stateProvider, $urlMatcherFactoryProvider) {
	"use strict";
	var urlMatcher =  $urlMatcherFactoryProvider.compile("/~/");

	var astate = { 
    name: 'homepage.section', //mandatory. This counter-intuitive requirement addressed in issue #368
    url: '/fdf/',
    parent: 'homepage',
    template: '<p></p>'
		};
	// Default State
	
	$urlRouterProvider.otherwise("/~/");

	/*
	$urlRouterProvider.when(astate.url, ['$state', '$match', '$stateParams', 
				function ($state, $match, $stateParams) {
					var jQ = jQuery,
							a;
										console.log($match);
		    console.log($stateProvider);
		    console.log(astate);
		    //$state.transitionTo(state, $match, false);
		    
		    $state.go(astate.parent);
				$state.go(astate);
		    jQ('html').scrollLeft(500);
		  }
    ]);
	*/
	$stateProvider
		.state('homepage', {
			url: "/{section}/{part}",


			onEnter: ['partOb', '$stateParams', function(partOb, $stateParams){
				console.log($stateParams);
				var jQ = window.jQuery,
						section =  $stateParams.section, 
						offset = 0;
				if(section !== '~'){
					offset = jQ('#'+section).offset().left - 50; 
				}
				jQ('html').animate({scrollLeft: offset}, 800);
				partOb.update(section, $stateParams.part);
			}],
			
			resolve: {
				intialmodel: function( InitialModel ){
					console.log(InitialModel);
					return InitialModel.InitialModel;
				},
				/*logIt: function(  ){
					consol.log('here' );
					return true;
				}*/
			},
			

			views: {
				'home': {
					templateUrl: 'http://lifelinearts.local/wp-content/themes/lla/inc/html/home.html', 
					controller: function( $scope , intialmodel , lla_wp, $stateParams){
						var jQ = jQuery,
								secotion = 0;
						// $('html, body').animate({scrollLeft:
						// $(currentElement).offset().left}, 800);
					//	console.log(secotion);

						//console.log($stateParams);	
						if($stateParams.id == 'hope'){
							console.log('found');	

							jQ('html').scrollLeft(500);	
						}
						
						$scope.model = intialmodel;
						$scope.line_img_url = $scope.template_dir + '/img/LLA_LineFull4000.jpg'
						
					},
					
				},
				'about':{ templateUrl: 'http://lifelinearts.local/wp-content/themes/lla/inc/html/about.html', 
					controller: function( $scope , intialmodel ){
						
						$scope.model = intialmodel.content[1];
						$scope.model.content.mainbool = false;
						$scope.model.content.main = {};
						
					}},
				'calender': {templateUrl: 'http://lifelinearts.local/wp-content/themes/lla/inc/html/calender.html', 
					controller: function( $scope , intialmodel ){
						
						$scope.model = intialmodel.content[2];
						
					}},
				'contact':{ templateUrl: 'http://lifelinearts.local/wp-content/themes/lla/inc/html/contact.html', 
					controller: function( $scope , intialmodel ){
						$scope.model = intialmodel.content[3];
						
					}}
			},

		}).state(astate);
		

				

	// Global catching of uiRouter errors (for development)
	/*$rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams,
			error){ 
		
		console.log( event, toState, toParams, fromState, fromParams, error );
	});*/
}])
.controller( 'MainController', [ '$scope', 'lla_wp', function( $scope , lla_wp){
	'use strict';

	
	$scope.template_dir = lla_wp.template_dir;
	
	console.log($scope);
}]);
