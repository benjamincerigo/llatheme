angular.module('llaapp.modelservices', [])
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

});
