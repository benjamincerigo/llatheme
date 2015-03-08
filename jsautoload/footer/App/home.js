window.angular.module('llaapp.home', [	'llaapp.inlineservices'])
.directive('quotes', [ '$interval', function($interval){
	'use strict';
	

	function link(scope, element, attrs) {
	//	var i;
		//console.log(scope);
	}
	return {
		restrict: 'AC',
		link: link
	};
}])
.provider('homepagemodel', function(InitialModelProvider){
	'use strict';
	if(!this.hasOwnProperty('model')){
		var i =  InitialModelProvider.$get();
		this.model = i.InitialModel;
	}
	this.getSection = function(section){
		var r;
		switch(section){
			case ('home'):
				r =  this.model;
				break;
			case ('about'):
				r = this.model.content['About'];
				break;
			case ('calender'):
				r = this.model.content['Calender'];
				break;
			case ('contact'):
				r = this.model.content['Contact'];
				break;
		}
		return r;
	};
	this.processState = function($stateParams){
		console.log('called function');

		console.log($stateParams);
	};
	this.$get = function (){
		var r = {
			model: this.model,
			getSection: this.getSection,
			state: this.processState
		};
		return r;
	};
});
