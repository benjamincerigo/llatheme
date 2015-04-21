window.angular.module('llaapp.util', [
	'ui.router'])
.provider('partOb', {
	subscribers: {}, // Hash map of sections and part and function that will be called
	currentState: {},
	update: function( $stateParams ){
		'use strict';
		var sec = this.search( $stateParams , 'section'),
				part = this.search( $stateParams , 'part' ),
				sub,
				fun;
		this.currentState = $stateParams;
		console.log(this);
		if(part === false){
			return null;
		}
		if(sec === false){
			return null;
		}
		sub = this.search( this.subscribers , sec );
		fun = this.search( sub , part );
		if(fun === false){
			return null;
		}
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
.directive('scrollable', [function(){
	'use strict';
	return {
		link: function( scope , element , attr){
			var $ = window.jQuery,
					op = {},
					nice;

			op.cursorcolor = '#765581';
			op.cursorborder = '0';
			if(attr.scrollable === 'x'){
				op.cursorwidth = '6px';
				//op.cursorminheight = '20px';
				op.autohidemode = 'false';
			}
			nice = 	$(element).niceScroll(op);
		
			if(attr.scrollable === 'x'){
				// hack foR no veritcal scroll
				var _super = nice.getContentSize;
				nice.getContentSize = function() {      
					var page = _super.call(nice);
					page.h = nice.win.height();
					return page;
				};
				nice.railh.addClass('lla_scrollbar_hr');
				nice.railh.removeAttr('style');

			}

		}
	};
}])
;
