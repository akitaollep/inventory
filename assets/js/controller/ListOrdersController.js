akitaApp.controller('ListOrdersController', function(
    $scope, 
    $uibModal, 
    OrderService, 
    CategoryService, 
    LocationService, 
    ServiceTypeService, 
    DTOptionsBuilder, 
    DTColumnBuilder, 
    dialogs,
    $rootScope, 
    $state,
    $stateParams){

    $scope.orders = [];
    $scope.orderForm = {};
    $scope.inProgress = false;

    $scope.dpOptions = {
        format: 'MM/DD/YYYY'
    };

    var modalInstance = null;
    if(sessionStorage.isLoggedIn){
        $rootScope.isLoggedIn = Boolean(sessionStorage.isLoggedIn);
    }

    if(sessionStorage.userRole){
        $rootScope.userRole = sessionStorage.userRole;
    }

    $scope.refreshOrder = refreshOrder;
    refreshOrder();
    function refreshOrder(){
        OrderService.getOrders($stateParams.type).then(function(response){
            $scope.orders = response;
            if($stateParams.type){
                $scope.type = $stateParams.type;
            }
        });
    }

    $scope.dtOptions = DTOptionsBuilder
        .newOptions()
        .withOption('responsive', true)
        .withOption('rowCallback', rowCallback)
        .withButtons(['print']);
    $scope.dtColumns = [
        DTColumnBuilder.newColumn('id').withTitle('ID'),
        DTColumnBuilder.newColumn('orderDate').withTitle('Date'),
        DTColumnBuilder.newColumn('name').withTitle('Payor'),
        DTColumnBuilder.newColumn(null).withTitle('Payor').renderWith(getPayorName),
        DTColumnBuilder.newColumn(null).withTitle('Deceased Name').renderWith(getDeceasedName),
        DTColumnBuilder.newColumn('sales').withTitle('Sales'),
        DTColumnBuilder.newColumn('vat').withTitle('Vat'),
        DTColumnBuilder.newColumn('amount').withTitle('Amount'),
        DTColumnBuilder.newColumn('type').withTitle('Category')
    ];

    function rowCallback(nRow, aData, iDisplayIndex, iDisplayIndexFull){
        $('td', nRow).unbind('click');
        $('td', nRow).bind('click', function() {
            $scope.$apply(function() {
                showViewTransactionModal(aData[0]);           
            });
        });
        return nRow;
    }

    function getDeceasedName(data, type, full, meta){
        return data.deceasedFirstName + ' ' + data.deceasedLastName;
    }

    function getPayorName(data, type, full, meta){
        return data.respondentFirstName + ' ' + data.respondentLastName;
    }

    $scope.showCreateNewTransactionForm = showCreateNewTransactionForm;

    function showCreateNewTransactionForm(){
        $scope.orderForm = {};
        $scope.categories = [];

        modalInstance = $uibModal.open({
            templateUrl: '/templates/orders/add.html',
            scope: $scope
        });

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
    }

    function showViewTransactionModal(orderId){
        OrderService.getOrder(orderId).then(function(order){
            order.orderDate = moment(order.orderDate);

            if(order.orderDetails){
                order.orderDetails.date = moment(order.orderDetails.date);
                order.orderDetails.expirationDate = moment(order.orderDetails.expirationDate);

                order.orderDetails.dateOfBirth = moment(order.orderDetails.dateOfBirth);
                order.orderDetails.dateOfDeath = moment(order.orderDetails.dateOfDeath);
            }

            $scope.orderForm = order;
            modalInstance = $uibModal.open({
                templateUrl: '/templates/orders/view.html',
                scope: $scope
            });
        });
    }

    $scope.submitForm = function(form){
        // if($scope.orderForm.type == 'Renewal' || $scope.orderForm.type == 'Interment'){
        //     if(!$scope.orderForm.intermentDate || !$scope.orderForm.expirationDate){
        //         return;
        //     }
        // }

        // if(!$scope.inProgress){
        //     $scope.inProgress = true;
            OrderService.addOrder($scope.orderForm).then(function(response){
                $scope.orders.push(response);
                $scope.orderForm = {};
                modalInstance.close('closed');
                $scope.inProgress = false;
            });
        // }
    }

    $scope.editForm = function(orderId){
        $state.go('editOrder', { orderId: orderId});
    }

    $scope.cancel = function(){
        modalInstance.dismiss('cancel');
    }

    $scope.deleteOrder = deleteOrder;

    function deleteOrder(orderId){
        var dlg = dialogs.confirm('Delete Order', 'Are you sure you want to delete this order?', { size: 'sm' });
        dlg.result.then(function(btn){
            OrderService.deleteOrder(orderId).then(function(response){
                $scope.cancel();
                $scope.refreshOrder();
            });
        }, function(btn){
            //Do nothing
        });
    }

    $scope.parseFloat = function(value){
        return parseFloat(value);
    }

    $scope.$watch('orderForm.amount', function(amount){
        if(!isNaN(parseFloat(amount / 1.12))){
            $scope.orderForm.sales = Number(parseFloat(amount / 1.12).toFixed(2));
        }

        if(!isNaN(parseFloat(amount - $scope.orderForm.sales))){
            $scope.orderForm.vat = Number(parseFloat(amount - $scope.orderForm.sales).toFixed(2));
        }
    });

    // $scope.$watch('orderForm.intermentDate', function(date){
    //     console.log(date);
    //     console.log($scope.orderForm.intermentType);
    //     if(!date){
    //         if($scope.orderForm.intermentType){
    //             $scope.orderForm.intermentType.$setDirty();
    //         }
    //     }
    // });

    // $scope.$watch('orderForm.sales', function(sales){
    //     if(!isNaN(parseFloat(sales * 0.12))){
    //         //console.log((sales * 0.12).toFixed(2));
    //         //$scope.orderForm.vat = parseFloat((sales * 0.12).toFixed(2));
    //         $scope.orderForm.vat = (sales * 0.12);
    //     }

    //     if(!isNaN(parseFloat(sales + $scope.orderForm.vat))){
    //         //$scope.orderForm.amount = parseFloat(sales + $scope.orderForm.vat);
    //         $scope.orderForm.amount = (sales + $scope.orderForm.vat);
    //     }
    // });

    $scope.$on('event:dataTableLoaded', function(event, loadedDT) {
        $('#min-date, #max-date').blur(function() {
            loadedDT.DataTable.draw();
        });
    });
});

// akitaApp.directive('checkDate', function(){
//     return {
//         //require: 'ngModel',
//         link: function(scope, elem, attrs, ctrl){
//             if(!scope.orderForm.intermentDate){
//                 //ctrl.$setValidity('invalidDate', true);
//             }else{
//                 //ctrl.$setValidity('invalidDate', false);
//             }
//         }
//     };
// });