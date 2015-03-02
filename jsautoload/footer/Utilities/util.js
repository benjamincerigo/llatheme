window.angular.module('llaapp.util', [
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
	subscribers: {}, // Hash map of sections and part and function that will be called
	currentState: {},
	update: function( $stateParams ){
		'use strict';
		console.log('update');
		var sec = this.search( $stateParams , 'section'),
				part = this.search( $stateParams , 'part' ),
				sub,
				fun;
		this.currentState = $stateParams;
		console.log(sec);
		console.log(part);
		if(part === false){
			return null;
		}
		if(sec === false){
			return null;
		}
		sub = this.search( this.subscribers , sec );
		fun = this.search( sub , part );
		if(fun === false){
			console.log('didnt find fun');
			return null;
		}
		console.log('called fun');
		console.log(fun);
		fun.callback();
	},
	search: function(o, find){
		'use strict';
		if(o.hasOwnProperty(find)){
			return o[find];	
		}else{
			return false;
		}
	},
	subscribe: function(section, part, fun){
		'use strict';
		var s = this.subscribers,
				ss;
		if(!s.hasOwnProperty(section)){
			s[section] = {};
		}
		ss = s[section];
		if(ss.hasOwnProperty(part)){
			ss[part] = fun;
		//	throw new Error('trying to set a part again');
		}
		ss[part] = fun;
		if(!this.hasOwnProperty('currentState')){
				return true;
		}
		if(!this.currentState.hasOwnProperty('section')){
			return true;
		}
		this.update(this.currentState);
		console.log(this.subscribers);
	},
	$get: function(){
		'use strict';
		return {
			update: this.update,
			search: this.search,
			subscribers: this.subscribers,
			subscribe: this.subscribe
		
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
