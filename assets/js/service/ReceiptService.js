akitaApp.service('ReceiptService', function($http, $q, $location){
	return {
		'getReceipt': function(receiptId){
			var defer = $q.defer();
			$http.get('/receipts/' + receiptId).success(function(resp){
				defer.resolve(resp);
			}).error(function(error){
				defer.reject(error);
			});

			return defer.promise;
		},
		// 'getReceipts': function(orderId){
		// 	var defer = $q.defer();
		// 	$http.get('/receipts/' + orderId).success(function(resp){
		// 		defer.resolve(resp);
		// 	}).error(function(error){
		// 		defer.reject(error);
		// 	});

		// 	return defer.promise;
		// },
		'addReceipt': function(receipt){
			var defer = $q.defer();
			$http.post('/receipts', receipt).success(function(resp){
				defer.resolve(resp);
			}).error(function(error){
				defer.reject(error);
			});

			return defer.promise;
		},
		'printReceipt': function(receiptId){
			$http.get('/receipts/print/' + receiptId, {responseType: 'arraybuffer'}).success(function(data){
				var file = new Blob([data], {type: 'application/pdf'});
				var fileURL = URL.createObjectURL(file);
				window.open(fileURL);
			});
		},
		'issueOR': function(receiptId, orDetails){
			var defer = $q.defer();
			$http.put('/receipts/' + receiptId, orDetails).success(function(resp){
				defer.resolve(resp);
			}).error(function(error){
				defer.reject(error);
			});

			return defer.promise;
		}
	};
});