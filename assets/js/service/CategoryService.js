akitaApp.service('CategoryService', function($http, $q, $location){
	return {
		'getCategories': function(){
			var defer = $q.defer();
			$http.get('/categories').success(function(resp){
				defer.resolve(resp);
			}).error(function(error){
				defer.reject(error);
			});

			return defer.promise;
		}
	};
});