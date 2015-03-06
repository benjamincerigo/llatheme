window.angular.module('llaapp.calender', ['llaapp.util'])
.directive('sectionSelectCal', ['partOb', function(partOb ){
	'use strict';
	var stat = {};
	function link(scope, element, attr) {
		var	callback = {}, 
			id = parseInt(attr.sectionSelectCal);
 
		console.log(id);
		callback.scope = scope;
		callback.element = element;
		callback.attr = attr;
		callback.selectIndex = id;
		if(id == 0){
			console.log('o');
			stat.first = scope;
			console.log(scope);
			console.log(scope.$parent);
			scope.$parent.model.content.main = scope.anevent;
			//stat.last = scope;
			console.log(scope.$parent);
		}
			
		if(scope.hasOwnProperty('anevent')){
			callback.callback = function(  ){
				var par = this.scope.$parent;
						console.log('called callback 1');
						console.log(this.scope.$parent);
					if(stat.hasOwnProperty('last')){
						stat.last.anevent.selected = false;	
					}
					stat.last = this.scope;
					this.scope.anevent.selected = true;
					par.model.content.main = this.scope.anevent;
					console.log('end of callback');
			}
			partOb.subscribe('calender', scope.anevent.lla_part_slug , callback);
		}else{
			console.log('did this');
			callback.callback = function(  ){
				console.log('called callback 2');
				console.log(stat);
				if(stat.hasOwnProperty('last')){
						stat.last.anevent.selected = false;	
				}
				if(stat.hasOwnProperty('first')){
					stat.first.anevent.selected = true;
					this.scope.model.content.main = stat.first.anevent; 
				}
				stat.last = stat.first;
			}
			partOb.subscribe('calender', '~', callback);
			partOb.subscribe('calender', '', callback);
		}
	}
	return {
		restrict: 'A',
		link: link
	};

}]);
