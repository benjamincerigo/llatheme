window.angular.module('llaapp.gallery', [
	'llaapp.inlineservices',
])
.provider('galleryPageModel',['lla_wpProvider','$qProvider', function(lla_wpProvider, $q){
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
	this.processState = function($statParams){
		var s = this.lla_search($stateParams, 'gallery'),
			p = this.lla_search($stateParams, 'part'),
			a = this.model;

			s = this.lla_search(a.content.posts, p);
			s.selectedBool = true;
	};
	this.lla_search = function(o, find){
		if(o.hasOwnProperty(find)){
			return o[find];	
		}else{
			return false;
		}
	};
	this.$get = ['$q',function ($q){
		var deferred = $q.defer(),
			r = {
				getSection: this.getSection,
				processState: this.processState,
				lla_search: this.lla_search,
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
