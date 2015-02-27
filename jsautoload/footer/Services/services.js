angular.module('llaapp.services', [
	'ui.router',
	'llaapp.util'
])
.service('TopNavFactory', function(){
	'use strict'
	var getModel  = function(name){
		var model;
		switch(name){
			case 'home':
				model = [
				{
					'title': 'home',
					'slug': 'home/',
				},
				{
					'title': 'about',
					'slug': 'about/',
				},
				{
					'title': 'calender',
					'slug': 'calender/',
				},
				{
					'title': 'contact',
					'slug': 'contact/',
				}
				];
				break;
		}
		return model;	
	};
	return{
		get: getModel
	};

})
.service('moveOnUrl', ['partOb', function(partOb){
	'use strict';
	var execute = function($stateParams){
		var jQ = window.jQuery,
				section =  $stateParams.section, 
				offset = 0;
		if(section === '~'){
			section = 'home';
		}
		offset = jQ('#'+ section).offset().left - 50; 
		jQ('html').animate({scrollLeft: offset}, 800);
		partOb.update( $stateParams );
	};
	return {
		'execute': execute
	};
}]);

