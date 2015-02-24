angular.module('llaapp.util', [
	'ui.router'])
/*.provider('observer', ['$rootScoop', '$location', function($rootScope, $location){
	'use strict';
	onIt: function(){
			$rootScope.$on('$routeChangeStart', function(){
			console.log('from observer');
			});
	} 

	$get: function ( $rootScope, $location){
		return{
			method:	this.onIt
		}
	}

}])*/
.provider('partOb', {
/*
	var urlMatcher =  $urlMatcherFactoryProvider.compile("/hello/hello");
	$urlRouter.when(urlMatcher,  function(){
		console.log('hi');

	});
*/subscibers: [],
	update: function(){
		'use strict';
		console.log('update');
	},
	$get: function(){
		'use strict';
		return {
			update: this.update,
		
		};
	}


})
.factory('_', function() {
	'use strict';
	  return window._; // assumes underscore has already been loaded on the page
})
.service('namespace', [ function(){
	'use strict';
	
	return function( o , s ){
		s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    s = s.replace(/^\./, '');           // strip a leading dot
    var a = s.split('.');
    while (a.length) {
        var n = a.shift();
        if (n in o) {
            o = o[n];
        } else {
					o[n] = {};
        }
    }
		return o;
	};
}])
;
