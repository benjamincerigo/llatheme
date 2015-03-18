window.angular.module('llaapp.gallery', [
	'llaapp.inlineservices',
])
.provider('galleryPageModel',['lla_wpProvider','$qProvider', function(lla_wpProvider, $q){
	'use strict';
	this.hi = function(){
		return 'hi';
	};
	this.$get = ['$q',function ($q){
		var deferred = $q.defer(),
			r = {
				hi: this.hi,
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
