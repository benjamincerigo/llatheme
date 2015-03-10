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
								$scope.mail.returnmessage = 'Your request is being process';
								$scope.mail.showdialog = true;	
								$scope.mail.fail = false;
								$scope.mail.success = false;
								formData = (
										{	action:'lla_simple_mail',
											nouce:lla_wp.nouce,
											'g-recaptcha-response':$scope.mail.captcha,
										'lla_contact_name':$scope.mail.name,
										'lla_contact_email':$scope.mail.email,
										'lla_contact_message':$scope.mail.message
										});
								console.log(formData);
								//Make Query
								jQuery.ajax({
									type: 'POST',
									url: lla_wp.ajax,
									data: formData,
									dataType: 'json'
								}).fail(function(response){
									console.log('fail');
									response = response.responseJSON;
									console.log(response);
									$scope.mail.showdialog = true;
									$scope.mail.fail = true;
									$scope.mail.returnmessage = response.message;
								}).done(function(response){
									console.log('done');
									console.log(response);
									response = response.responseJSON;
									$scope.showdialog = true;
									$scope.mail.returnmessage = response.message;
									$scope.success = true;
								});
							}
						}
					}],
				}
			},
			
		});
}]);
