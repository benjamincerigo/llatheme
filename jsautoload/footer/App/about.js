angular.module('llaapp.about', ['llaapp.util'])
.directive('sectionSelect', ['partOb', '$filter', 'namespace', function(partOb, $filter, namespace){
	'use strict';

	function link(scope, element, attr) {
		var args = attr.sectionSelect.split(','),
				callback = {};
		callback.callback = function(  ){
					console.log('called callback');
					console.log(this.scope.post);
					console.log(this.scope);
					
				this.scope.selectbool = true;
					console.log('end of call abck');
				};
		callback.scope = scope;
		callback.element = element;
		callback.attr = attr;
			partOb.subscribe('about', 'morag', callback);
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
