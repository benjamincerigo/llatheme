angular.module('llaapp.home', [])
.directive('quotes', [ '$interval', function($interval){
	'use strict';
	

	function link(scope, element, attrs) {
		var i;
		//console.log(scope);




	}

	return {
		restrict: 'AC',
		link: link

	};
	


}]);
