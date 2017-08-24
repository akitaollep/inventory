akitaApp.controller('EditOrderController', function(
        $scope, 
        $uibModal, 
        $stateParams,
        $state,
        $rootScope,
        OrderService, 
        CategoryService, 
        ServiceTypeService,
        LocationService,
        ReceiptService,
        DTOptionsBuilder, 
        DTColumnBuilder){

    $scope.receiptForm = {};
    $scope.orForm = {};
    //$scope.receiptForm.discount.$setValidity('LimitExceeded', false);
    var modalInstance = null;

    if(sessionStorage.isLoggedIn){
        $rootScope.isLoggedIn = Boolean(sessionStorage.isLoggedIn);
    }

    if(sessionStorage.userRole){
        $rootScope.userRole = sessionStorage.userRole;
    }

    $scope.dpOptions = {
        format: 'MM/DD/YYYY'
    };

	$scope.dtOptions = DTOptionsBuilder
		.newOptions()
		.withOption('paging', false)
		.withOption('searching', false)
        .withOption('rowCallback', rowCallback)
		.withOption('responsive', true);

    $scope.dtColumns = [
        DTColumnBuilder.newColumn('id').withTitle('ID'),
        DTColumnBuilder.newColumn('orNumber').withTitle('OR Number'),
        DTColumnBuilder.newColumn('receiptDate').withTitle('Date'),
        //DTColumnBuilder.newColumn('sales').withTitle('Sales'),
        //DTColumnBuilder.newColumn('vat').withTitle('Vat'),
        DTColumnBuilder.newColumn('amount').withTitle('Amount')
    ];

    OrderService.getOrder($stateParams.orderId).then(function(order){
        OrderService.getTypes().then(function(types){
            $scope.categories = types;
        });

        OrderService.getLotTypes().then(function(locations){
            $scope.locations = locations;
        });

        OrderService.getIntermentTypes().then(function(types){
            $scope.serviceTypes = types;
        });

        OrderService.getPaymentModes().then(function(paymentModes){
            $scope.paymentModes = paymentModes;
        });

        OrderService.getLapidaSize().then(function(sizes){
            $scope.sizes = sizes;
        });

        OrderService.getLapidaOptions().then(function(options){
            $scope.lapidaOptions = options;
        });

        $scope.receipts = order.receipts;

        if(order.orderDetails){
            order.orderDate = moment(order.orderDate);
            order.orderDetails.date = moment(order.orderDetails.date);
            order.orderDetails.expirationDate = moment(order.orderDetails.expirationDate);

            order.orderDetails.dateOfBirth = moment(order.orderDetails.dateOfBirth);
            order.orderDetails.dateOfDeath = moment(order.orderDetails.dateOfDeath);
        }

        $scope.orderForm = order;
    });

    function rowCallback(nRow, aData, iDisplayIndex, iDisplayIndexFull){
        $('td', nRow).unbind('click');
        $('td', nRow).bind('click', function() {
            $scope.$apply(function() {
                showViewReceipt(aData[0]);
            });
        });
        return nRow;
    }

    function showViewReceipt(receiptId){
        ReceiptService.getReceipt(receiptId).then(function(receipt){            
            receipt.receiptDate = moment(receipt.receiptDate);
            $scope.receiptForm = receipt;

            modalInstance = $uibModal.open({
                templateUrl: '/templates/receipts/add.html',
                scope: $scope
            });
        });
    }

    $scope.showCreateNewReceiptForm = showCreateNewReceiptForm;
    $scope.closeCreateNewReceiptForm = closeCreateNewReceiptForm;
    $scope.submitNewReceiptForm = submitNewReceiptForm;
    $scope.submitForm = submitForm;
    $scope.back = back;
    $scope.printReceipt = printReceipt;
    $scope.issueOR = issueOR;
    $scope.closeIssueORForm = closeIssueORForm;
    $scope.submitORNumber = submitORNumber;

    // $scope.$watch('orderForm.sales', function(sales){
    // 	if($scope.orderForm){
    // 		if(!isNaN(parseFloat(sales * 0.12))){
	   //  		//console.log((sales * 0.12).toFixed(2));
	   //  		//$scope.orderForm.vat = parseFloat((sales * 0.12).toFixed(2));
	   //  		$scope.orderForm.vat = (sales * 0.12);
	   //  	}

	   //  	if(!isNaN(parseFloat(sales + $scope.orderForm.vat))){
	   //  		//$scope.orderForm.amount = parseFloat(sales + $scope.orderForm.vat);
	   //  		$scope.orderForm.amount = (sales + $scope.orderForm.vat);
	   //  	}
    // 	}
    // });

    $scope.$watch('orderForm.amount', function(amount){
        if(!$scope.orderForm){
            return;
        }

        if(!isNaN(parseFloat(amount / 1.12))){
            $scope.orderForm.sales = Number(parseFloat(amount / 1.12).toFixed(2));
        }

        if(!isNaN(parseFloat(amount - $scope.orderForm.sales))){
            $scope.orderForm.vat = Number(parseFloat(amount - $scope.orderForm.sales).toFixed(2));
        }
    });

    function submitNewReceiptForm(){
        var currentTotalAmount = _.sumBy($scope.receipts, function(receipt){
            return receipt.amount;
        });

        currentTotalAmount += $scope.receiptForm.amount;

        if($scope.orderForm.amount < currentTotalAmount){
        //if($scope.orderForm.sales < currentTotalAmount){
            $scope.errorMessage = 'Total OR amount cannot be greater than the Order amount!';
        }else{
            if(!$scope.inProgress){
                $scope.inProgress = true;
                $scope.receiptForm.order = $scope.orderForm.id;
                ReceiptService.addReceipt($scope.receiptForm).then(function(response){
                    $scope.receipts.push(response);
                    $scope.receiptForm = {};
                    modalInstance.close('closed');
                    $scope.inProgress = false;

                    ReceiptService.printReceipt(response.id);
                });
            }
        }
    }

    function submitORNumber(){
        if(!$scope.inProgress){
            $scope.inProgress = true;
            ReceiptService.issueOR($scope.receiptForm.id, $scope.orForm).then(function(response){
                $scope.receipts = response;
                $scope.orForm = {};
                modalInstance.close('closed');
                $scope.inProgress = false;
            });
        }
    }

    function issueOR(){
        modalInstance.dismiss('cancel');
        modalInstance = $uibModal.open({
            templateUrl: '/templates/receipts/issueOR.html',
            scope: $scope,
            controller: 'AddReceiptController'
        });
    }

    function printReceipt(){
        ReceiptService.printReceipt($scope.receiptForm.id);
    }

    function showCreateNewReceiptForm(){
        modalInstance = $uibModal.open({
            templateUrl: '/templates/receipts/add.html',
            scope: $scope,
            controller: 'AddReceiptController'
        });
    }

    function closeCreateNewReceiptForm(){
        $scope.receiptForm = {};
        $scope.errorMessage = undefined;
        modalInstance.dismiss('cancel');
    }

    function closeIssueORForm(){
        $scope.orForm = {};
        $scope.errorMessage = undefined;
        modalInstance.dismiss('cancel');
    }

    function submitForm(){
        if(!$scope.inProgress){
            $scope.inProgress = true;
            OrderService.editOrder($scope.orderForm).then(function(response){
                $scope.orderForm = {};
                $state.go('dashboard');
                $scope.inProgress = false;
            });
        }
    }

    function back(){
        $state.go('dashboard');
    }
});