window.angular.module('llaapp.about', ['llaapp.util'])
.directive('sectionSelect', ['partOb', function(partOb ){
	'use strict';
	var stat = {};
	function link(scope, element, attr) {
		var	callback = {}; 
		callback.scope = scope;
		callback.element = element;
		callback.attr = attr;
		if(scope.hasOwnProperty('post')){
			scope.selectbool = false;
			callback.callback = function(  ){
				var par = this.scope.$parent;
						console.log('called callback');
					//	console.log(this.scope);
					if(stat.hasOwnProperty('last')){
						stat.last.post.selectbool = false;	
					}
					stat.last = this.scope;
					this.scope.post.selectbool = true;
					par.model.content.main.selected = true;
					par.model.content.main.post = this.scope.post;
					console.log('end of callback');
			};
			partOb.subscribe('about', scope.post.lla_part_slug , callback);
		}else{
			callback.callback = function(  ){
				console.log('called callback');
				stat.last.post.selectbool = false;	
				this.scope.model.content.main.selected = false;
				console.log('end of callback');
			};
			partOb.subscribe('about', '~', callback);
			partOb.subscribe('about', '', callback);
		}
	}
	return {
		restrict: 'A',
		link: link
	};

}]);
