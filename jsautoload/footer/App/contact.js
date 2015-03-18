window.angular.module('llaapp.contact', [
	'reCAPTCHA',
	'llaapp.inlineservices',
])
.directive('contactFormProcess',  function(){
	'use strict';
	return {
		restrict: 'A',
		controller: ['$scope', 'lla_wp', 'reCAPTCHA' , function($scope, lla_wp, reCAPTCHA){
				var re = lla_wp.recaptchakey; 
				$scope.mail  = {};
				reCAPTCHA.setPublicKey(re);
				$scope.mailrequest = {};
				$scope.mailrequest.showdialog = false;
				$scope.mailrequest.success = false;
				$scope.mailrequest.fail = false;
				$scope.mailrequest.loading = false;
				$scope.mailrequest.errors = {};

				$scope.submitMail= function () {
					var formData;
					if($scope.registerForm.$valid) {
						$scope.mailrequest.returnmessage = 'Your request is being process';
						$scope.mailrequest.loading = true;
						$scope.mailrequest.showdialog = true;	
						$scope.mailrequest.fail = false;
						$scope.mailrequest.success = false;
						formData = (
								{	action:'lla_simple_mail',
									nouce:lla_wp.nouce,
									'g-recaptcha-response':$scope.mail.captcha,
								'lla_contact_name':$scope.mail.name,
								'lla_contact_email':$scope.mail.email,
								'lla_contact_message':$scope.mail.message
								});
						//Make Query
						window.jQuery.ajax({
							type: 'POST',
							url: lla_wp.ajax,
							data: formData,
							dataType: 'json'
						}).fail(function(response){
							$scope.$apply(function(){
								$scope.mailrequest.showdialog = true;
								$scope.mailrequest.loading = false;
								$scope.mailrequest.fail = true;
								$scope.mailrequest.errors = response.responseJSON.errors;
							});
						}).done(function(response){
							$scope.$apply(function(){
							$scope.mailrequest.showdialog = true;
							$scope.mailrequest.loading = false;
							$scope.mailrequest.returnmessage = response.message;
							$scope.mailrequest.success = true;
							$scope.mail.captcha = '';
							$scope.mail.email = '';
							$scope.mail.message = '';
							$scope.mail.name = '';
							reCAPTCHA.reload();
							$scope.registerForm.$setPristine();
							});
						});
					}
				};
		}]
	};
});


