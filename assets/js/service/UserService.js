akitaApp.service('UserService', function($http, $q, $location){
	return {
		'getUser': function(userId){
			var defer = $q.defer();
			$http.get('/users/' + userId).success(function(resp){
				defer.resolve(resp);
			}).error(function(error){
				defer.reject(error);
			});

			return defer.promise;
		},
		'getUsers': function(){
			var defer = $q.defer();
			$http.get('/users').success(function(resp){
				defer.resolve(resp);
			}).error(function(error){
				defer.reject(error);
			});

			return defer.promise;
		},
		'addUser': function(user){
			var defer = $q.defer();
			$http.post('/users', user).success(function(resp){
				defer.resolve(resp);
			}).error(function(error){
				defer.reject(error);
			});

			return defer.promise;
		},
		'deleteUser': function(userId){
			var defer = $q.defer();
			$http.delete('/users/' + userId).success(function(resp){
				defer.resolve(resp);
			}).error(function(error){
				defer.reject(error);
			});

			return defer.promise;
		},
		'changePassword': function(user){
			var defer = $q.defer();
			$http.put('/password', user).success(function(resp){
				defer.resolve(resp);
			}).error(function(error){
				defer.reject(error);
			});

			return defer.promise;
		},
		'getUserRoles': function(){
			var defer = $q.defer();
			$http.get('/users/roles').success(function(resp){
				defer.resolve(resp);
			}).error(function(error){
				defer.reject(error);
			});

			return defer.promise;
		}
	};
});