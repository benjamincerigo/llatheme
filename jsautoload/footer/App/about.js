angular.module('llaapp.about', [])
.directive('sectionSelect', [ function(){
	'use strict';

	var oneselected=false; //static vaiable  that conatins the element of the last clicked


	function link(scope, element) {
		

		console.log(scope);
		element.on('click', function(){
			var toAdd = scope.post.post_content;

			element.after('<div>'+toAdd + '</div>');
			oneselected = element;




		});
		


	}

	return {
		restrict: 'A',
		link: link
	};

}]);