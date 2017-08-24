akitaApp.service('ServiceTypeService', function($http, $q, $location){
	return {
		'getServiceTypes': function(){
			var defer = $q.defer();
			$http.get('/serviceTypes').success(function(resp){
				defer.resolve(resp);
			}).error(function(error){
				defer.reject(error);
			});

			return defer.promise;
		}
	};
});