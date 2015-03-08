window.angular.module('llaapp.calender', ['llaapp.util'])
.directive('sectionSelectCal', ['partOb', function(partOb ){
	'use strict';
	function link(scope, element, attr) {
		var	callback = {}, 
			id = parseInt(attr.sectionSelectCal);
 
		console.log('loaded the thing');
		console.log(id);
		callback.scope = scope;
		callback.element = element;
		callback.attr = attr;
		callback.selectIndex = id;
		if(id === 0){
			if( !scope.$parent.selected.hasOwnProperty('init') ){
				scope.$parent.selected.init = scope;
			}
			if( !scope.$parent.model.content.main.hasOwnProperty('anevent') ){
				scope.$parent.model.content.main = scope.anevent;
				scope.$parent.selected.last = scope;
			}
			if(!scope.anevent.hasOwnProperty('selected')){
				scope.anevent.selectedbool= true;
			}
		}
			
		if( id >= 0 ){
			callback.callback = function(  ){
				var par = this.scope.$parent;
				console.log(this.selectIndex);
				if(!par.selected.last){
					par.selected.last.anevent.selectedbool = false;	
				}
				if(this.selectIndex !== 0 ){
				par.selected.last = this.scope;
				} else {
					par.selected.last = false;
				}
				this.scope.anevent.selected = true;
				par.model.content.main = this.scope.anevent;
			};
			partOb.subscribe('calender', scope.anevent.lla_part_slug , callback);
		}else if( id < 0 ){
			callback.callback = function(  ){
				console.log('called callback 2');
				console.log(this.selectIndex);
				if(this.scope.selected.hasOwnProperty('last') && !this.scope.selected.last){
						this.scope.selected.last.anevent.selectedbool = false;	
				}
				if(this.scope.selected.hasOwnProperty('init')){
					this.scope.selected.init.anevent.selectedbool = true;
					this.scope.model.content.main = this.scope.selected.init.anevent; 
				}
				this.scope.selected.last  = false;
			};
			partOb.subscribe('calender', '~', callback);
		}
	}
	return {
		restrict: 'A',
		link: link
	};

}]);
