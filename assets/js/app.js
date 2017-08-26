'use strict';

var akitaApp = angular.module('akitaApp', 
	['ui.router', 
	'ui.bootstrap', 
	'datatables', 
	'datatables.buttons', 
	'ngResource', 
	'ae-datetimepicker', 
	'dialogs.main']);

akitaApp.config(function(
	$stateProvider, 
	$urlRouterProvider, 
	$httpProvider, 
	$locationProvider){
	
	$httpProvider.interceptors.push(function($q, $location, $rootScope){
		return {
			response: function(response){
				$rootScope.errorMessage = undefined;
				return response;
			},
			responseError: function(response){
				if(response.status === 403){
					sessionStorage.removeItem('isLoggedIn');
					sessionStorage.removeItem('userRole');
					$rootScope.isLoggedIn = false;
					$rootScope.userRole = undefined;
					$location.url('/login');
				}else if(response.status == 400){
					$rootScope.errorMessage = response.data;
					console.log($rootScope.errorMessage);
				}

				return $q.reject(response);
			}
		};
	});

	$stateProvider

	.state('dashboard', {
		url: '/',
		templateUrl: '/templates/orders.html',
		controller: 'ListOrdersController',
		authenticate: true
	})

	.state('renewals', {
		url: '/orders?type',
		templateUrl: '/templates/orders.html',
		controller: 'ListOrdersController',
		authenticate: true
	})

	.state('editOrder', {
		url: '/orders/:orderId',
		templateUrl: '/templates/orders/edit.html',
		controller: 'EditOrderController'
	})

	.state('users', {
		url: '/users',
		templateUrl: '/templates/users.html',
		controller: 'ListUsersController'
	})

	.state('password', {
		url: '/password',
		templateUrl: '/templates/users/password.html',
		controller: 'EditUserController',
		authenticate: true
	})

	.state('login', {
		url: '/login',
		templateUrl: '/templates/login.html',
		controller: function($scope, AuthService, $location){
			$scope.formData = {};

			$scope.login = function(){
				AuthService.login($scope.formData).then(function(response){
					if(response.user){
						$location.url('/');
					}else{
						$scope.formData.email = '';
						$scope.formData.password = '';
						$scope.errorMessage = 'Invalid username and password!';
					}
				});
			}
		}
	})

	.state('receipts', {
		url: '/receipts',
		controller: function(OrderService){
			OrderService.generateReceipt();
		}
	})

	;
	$urlRouterProvider.otherwise("/");
});

akitaApp.directive('myNotifications', ['$interval', 'OrderService', function($interval, OrderService){
	// return function(scope, element, attrs){
	// 	OrderService.getOrders('renewals').then(function(response){
	// 		var total = response.length;
	// 		if(total > 0){
	// 			element.text(total);
	// 		}else{
	// 			element.text('');
	// 		}
	//     });

	// 	$interval(function(){
	// 		if(sessionStorage.isLoggedIn){
	// 			OrderService.getOrders('renewals').then(function(response){
	// 		        var total = response.length;
	// 				if(total > 0){
	// 					element.text(total);
	// 				}else{
	// 					element.text('');
	// 				}
	// 		    });
	// 		}
	// 	}, 300000);
	// }
}]);

akitaApp.directive('printButton', function(){
	return {
		restrict: 'A',
		link: function(scope, element){
			var e = angular.element(element);
			e.on('click', function(){
				$('.buttons-print').click();
			});
		}
	};
});

// akitaApp.run(function() {
//     $.fn.dataTable.ext.search.push(
//         function(settings, data, dataIndex) {
//             var minDate = $('#min-date').val();
//             var maxDate = $('#max-date').val();
//             var min = minDate != '' ? moment(minDate) : moment(0);
//             var max = maxDate != '' ? moment(maxDate) : moment('31 Dec 2030');
//             var date = moment(data[0]);

//             if(min.isBefore(date) && date.isBefore(max)){
//             	return true;
//             }

//             return false;
//         }
//     );
// });