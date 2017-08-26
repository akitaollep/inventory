akitaApp.service('OrderService', function($http, $q, $location){
	return {
		'getOrder': function(orderId){
			var defer = $q.defer();
			$http.get('/orders/' + orderId).success(function(resp){
				defer.resolve(resp);
			}).error(function(error){
				defer.reject(error);
			});

			return defer.promise;
		},
		'getOrders': function(type){
			var url = '/orders';

			if(type){
				url += ('?type=renewals');
			}

			console.log('Start of api call: ' + new Date());
			var defer = $q.defer();
			$http.get(url).success(function(resp){
				console.log('End of api call: ' + new Date());
				defer.resolve(resp);
			}).error(function(error){
				defer.reject(error);
			});

			return defer.promise;
		},
		'addOrder': function(order){
			var defer = $q.defer();
			$http.post('/orders', order).success(function(resp){
				defer.resolve(resp);
			}).error(function(error){
				defer.reject(error);
			});

			return defer.promise;
		},
		'editOrder': function(order){
			var defer = $q.defer();
			$http.post('/orders/' + order.id, order).success(function(resp){
				defer.resolve(resp);
			}).error(function(error){
				defer.reject(error);
			});

			return defer.promise;
		},
		'deleteOrder': function(orderId){
			var defer = $q.defer();
			$http.delete('/orders/' + orderId).success(function(resp){
				defer.resolve(resp);
			}).error(function(error){
				defer.reject(error);
			});

			return defer.promise;
		},
		'getTypes': function(){
			var defer = $q.defer();
			$http.get('/orders/types').success(function(resp){
				defer.resolve(resp);
			}).error(function(error){
				defer.reject(error);
			});

			return defer.promise;
		},
		'getLotTypes': function(){
			var defer = $q.defer();
			$http.get('/orders/lotTypes').success(function(resp){
				defer.resolve(resp);
			}).error(function(error){
				defer.reject(error);
			});

			return defer.promise;
		},
		'getPaymentModes': function(){
			var defer = $q.defer();
			$http.get('/lotSalesOrders/paymentModes').success(function(resp){
				defer.resolve(resp);
			}).error(function(error){
				defer.reject(error);
			});

			return defer.promise;
		},
		'getLapidaSize': function(){
			var defer = $q.defer();
			$http.get('/lapidaOrders/size').success(function(resp){
				defer.resolve(resp);
			}).error(function(error){
				defer.reject(error);
			});

			return defer.promise;
		},
		'getLapidaOptions': function(){
			var defer = $q.defer();
			$http.get('/lapidaOrders/options').success(function(resp){
				defer.resolve(resp);
			}).error(function(error){
				defer.reject(error);
			});

			return defer.promise;
		},
		'getIntermentTypes': function(){
			var defer = $q.defer();
			$http.get('/orders/orderTypes').success(function(resp){
				defer.resolve(resp);
			}).error(function(error){
				defer.reject(error);
			});

			return defer.promise;
		},
		'generateReceipt': function(){
			$http.get('/receipts', {responseType: 'arraybuffer'}).success(function(data){
				var file = new Blob([data], {type: 'application/pdf'});
				var fileURL = URL.createObjectURL(file);
				window.open(fileURL);
			});
		}
	};
});