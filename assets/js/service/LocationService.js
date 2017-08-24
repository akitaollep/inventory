akitaApp.service('LocationService', function($http, $q, $location){
	return {
		'getLocations': function(){
			var defer = $q.defer();
			$http.get('/locations').success(function(resp){
				defer.resolve(resp);
			}).error(function(error){
				defer.reject(error);
			});

			return defer.promise;
		}
	};
});