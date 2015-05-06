window.angular.module('llaapp.gallery', [
	'llaapp.inlineservices',
])
.provider('galleryPageModel',['lla_wpProvider','$qProvider','$rootScopeProvider', function(lla_wpProvider, $q, $scope){
	'use strict';
	this.hi = function(){
		return 'hi';
	};
	this.getSection = function(section){
		var r;
		console.log(this);
		switch(section){
			default:
				r = this.model;
				break;
		}
		console.log(r);
		return r;
	};
	this.processState = function($stateParams){
		var s = this.lla_search($stateParams, 'picture'),
			p = this.lla_search($stateParams, 'extra'),
			a = this.model;
		if(s){
			s = this.lla_search_slug(a.content.posts, s);
			if(p === 'full'){
				s.animate = 'in';
				s.selectedbool = true;
			}else{
				s.selectedbool = false;
			}
		}
	};
	this.lla_search = function(o, find){
		if(typeof o === 'undefined' || o === null ){
			return false;
		}
		if(o.hasOwnProperty(find)){
			return o[find];	
		}else{
			return false;
		}
	};
	this.lla_search_slug = function(o, find){
		var r = false,
			key;
		for (key in o) {
			var p = o[key];
			r =this.lla_search(p, 'lla_part_slug');
			if( r === find ){
				r = p;
			} else {
				r = false;
			}
			if( r !== false ){
				break;
			}
		}
		return r;
	};
	this.$get = ['$q',function ($q){
		var deferred = $q.defer(),
			r = {
				getSection: this.getSection,
				state: this.processState,
				lla_search: this.lla_search,
				lla_search_slug: this.lla_search_slug,
			}, 
			getData;
		getData = (
				{	action:'lla_get_gallery',
					nouce:lla_wpProvider.n
				}
				);
		console.log(getData);
			window.jQuery.ajax({
				type: 'POST',
				url: lla_wpProvider.a,
				data: getData,
				dataType: 'json'
			}).fail(function(response){
				console.log(response);
				console.log(response.responseText);
				r.fail = {};
				r.fail.message = response.message;
				deferred.resolve(r);
			}).done(function(response){
				console.log('done');
				console.log(response);
				r.model = response;
				deferred.resolve(r);
			});
		return deferred;
	}];
}]);
