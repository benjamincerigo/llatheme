angular.module('llaapp.about', ['llaapp.util'])
.directive('sectionSelect', ['partOb', '$filter', 'namespace', function(partOb, $filter, namespace){
	'use strict';

	function link(scope, element, attr) {
		var args = attr.sectionSelect.split(','),
				callback = {}, 
				callback2 = {};
		scope.selectbool = false;
		console.log('called link');
		console.log(scope);
		callback.callback = function(  ){
					console.log('called callback');
				//	console.log(this.scope);
				this.scope.post.selectbool = true;
					console.log('end of call abck');
				};
		callback2.callback = function(){
			//console.log(this.element);
			this.scope.selectbool = true;
			jQuery(this.element).addClass('ng-hide');
		};
		callback2.scope = scope;
		callback2.element = element;

		callback.scope = scope;
		callback.element = element;
		callback.attr = attr;
		if(scope.hasOwnProperty('post')){
			partOb.subscribe('about', scope.post.post_title , callback);
		}else{
			partOb.subscribe('about', '~', callback);
		}
//			partOb.subscribe('about', 'hide', callback2);
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
