angular.module('llaapp.about', [])
.directive('sectionSelect', [ '$filter', function($filter){
	'use strict';

	function link(scope, element, attr) {
		

		
		//scope.model.content.mainbool = false;
		console.log(attr);
		console.log(scope);
		element.on('click', function(){
			var content = scope.model.content,
					array = content.posts;
			
			if(content.mainbool){
				// put the last clicked back in array
				scope.$apply(function() {
					content.mainbool = false;
					array.push(content.main);
				});

			}

			//add the clicked to the main and remove from posts array
				
			scope.$apply(function(){
				content.main = scope.post;
				content.mainbool = true;
				element = array.map(function(x) {return x.ID; }).indexOf(scope.post.ID);
				array.splice(element, 1);
				$filter('orderBy')(array, array.map(function(x) {return x.post_date; }));
			});


		});

		
		


	}

	return {
		restrict: 'A',
		link: link
	};

}]);