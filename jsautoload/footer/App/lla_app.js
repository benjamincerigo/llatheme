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
	'llaapp.inlineservices'
 
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
					controller: ['$scope',  'homepagemodel', 'reCAPTCHA', 'lla_wp' , '$http', function( $scope , homepagemodel, reCAPTCHA, lla_wp, $http){ 
						var re = lla_wp.recaptchakey; 
						$scope.model = homepagemodel.getSection('contact');
						$scope.mail  = {};
						reCAPTCHA.setPublicKey(re);

					  $scope.submitMail= function () {
							var formData;
							if($scope.registerForm.$valid) {
								console.log('Form is valid');
								
								console.log($scope.registerForm);
									$http.post( lla_wp.ajax, ({'nouce':lla_wp.nouce,action:'lla_simple_mail'})).
										success(function(data, status, headers, config) {
											// this callback will be called asynchronously
											// when the response is available
											console.log('succes');
											console.log(data);
										}).
										error(function(data, status, headers, config) {
											// called asynchronously if an error occurs
											// or server returns response with an error status.
											console.log('error');
											console.log(data);
										});	
								formData = ({action:'lla_simple_mail',nouce:lla_wp.nouce});
								console.log(formData);
								//Make Query
								jQuery.ajax({
									type: 'POST',
									url: lla_wp.ajax,
									data: formData,
									dataType: 'json'
								}).fail(function(response){
									console.log('fail');
									console.log(response);
								}).done(function(response){
									console.log('done');
									console.log(response);
								});
							}
						}
					}],
				}
			},
			
		});
}]);
