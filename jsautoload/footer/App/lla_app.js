var llaapp = angular.module('llaapp', [
	//'ui.router',
	'ui.router',
	'ngResource',
	'restangular',
	'llaapp.services',
	'llaapp.home',
	'llaapp.about',
	'llaapp.util',
	'llaapp.modelservices'
 
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
llaapp.config( ['$urlRouterProvider', '$stateProvider', '$urlMatcherFactoryProvider', 'lla_wpProvider',
	function( $urlRouterProvider , $stateProvider, $urlMatcherFactoryProvider, lla_wpProvider) {
	"use strict";
	var topnavState = { 
			templateUrl: lla_wpProvider.t + '/inc/html/topnav.html', 
			controller: ['$scope', 'TopNavFactory', function($scope, TopNavFactory){
				'use strict';
				$scope.model = {};
				$scope.model.menuItems = TopNavFactory.get('home');
			}]
		};
	console.log(lla_wpProvider);	
	$urlRouterProvider.otherwise("/~/");

	$stateProvider
		.state('homepage', {
			abstract: true,
			/*
			onEnter: ['partOb', '$stateParams', function(partOb, $stateParams){
				console.log($stateParams);
				console.log(window);
				var jQ = window.jQuery,
						section =  $stateParams.section, 
						offset = 0;
				console.log(jQ('#'+section));
				/*
				if(section !== '~'){
					offset = jQ('#'+ section).offset().left - 50; 
				}
				jQ('html').animate({scrollLeft: offset}, 800);
				partOb.update(section, $stateParams.part);
			}],
			*/
			templateUrl: lla_wpProvider.t +  '/inc/html/home_page.html',
			controller: [ '$scope', 'lla_wp', function( $scope , lla_wp){
				$scope.template_dir = lla_wp.template_dir;
				console.log($scope);
			}]
		})
		.state('homepage.stuff', {
			url: '/~/',
			resolve: {
				intialmodel: function( InitialModel ){
					console.log(InitialModel);
					return InitialModel.InitialModel;
				}
			},
			views: {
			'topnav': topnavState,
				'home': {
					templateUrl: lla_wpProvider.t + '/inc/html/home.html', 
					controller: function( $scope , intialmodel , lla_wp, $stateParams){
						'use strict';
						var jQ = jQuery,
								secotion = 0;
						if($stateParams.id == 'hope'){
							jQ('html').scrollLeft(500);	
						}
						$scope.model = intialmodel;
						$scope.line_img_url = $scope.template_dir + '/img/LLA_LineFull4000.jpg'
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
	/*$rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams,
			error){ 
		console.log( event, toState, toParams, fromState, fromParams, error );
	});*/
}])
