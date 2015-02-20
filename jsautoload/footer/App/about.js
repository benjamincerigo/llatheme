angular.module('llaapp.about', ['llaapp.util'])
.directive('sectionSelect', ['$filter', 'namespace', function($filter, namespace){
	'use strict';

	function link(scope, element, attr) {
		var args = attr.sectionSelect.split(',');
			//	first = namespace(scope, args[1]), // object you wnat to move 
				//second = namespace(scope, args[2]); // obect you want to move to
				// third is the array you want to move it from. 
	/*
		scope.selectbool = false;
		element.on('click', function(){
			// hide the element
			scope.$appy(function(){
				scope.selectbool = true;
				$element.hide();
				// first to second
				// if array the push
				console.log(s3gt
				//second = first;
			}
		});
		*/
	}
	return {
		restrict: 'A',
		link: link
	};

}]);
