akitaApp.controller('AddOrderController', function(
    $scope, 
    $uibModal, 
    $stateParams,
    $state,
    OrderService, 
    CategoryService, 
    ReceiptService,
    DTOptionsBuilder, 
    DTColumnBuilder){

    $scope.$watch('parent.intermentDate', function(sales){
        console.log(1)
    });
});