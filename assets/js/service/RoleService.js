akitaApp.service('RoleService', function($http, $q, $location){
	return {
		'getRoles': function(){
			var defer = $q.defer();
			$http.get('/roles').success(function(resp){
				defer.resolve(resp);
			}).error(function(error){
				defer.reject(error);
			});

			return defer.promise;
		}
	};
});