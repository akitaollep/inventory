akitaApp.service('AuthService', function($http, $q, $location, $rootScope){
	return {
		'isLoggedIn': function(){
			var defer = $q.defer();
			$http.get('/isAuthenticated').success(function(resp){
				defer.resolve(resp);
			}).error(function(error){
				defer.reject(error);
			});

			return defer.promise;
		},
		'login': function(user){
			var defer = $q.defer();
			$http.post('/login', user).success(function(resp){
				sessionStorage.isLoggedIn = true;
				sessionStorage.userRole = resp.user.role;
				console.log(resp.user);
				defer.resolve(resp);
			}).error(function(error){
				defer.reject(error);
			});

			return defer.promise;
		}
	};
});