akitaApp.controller('AddReceiptController', function(
	$scope, 
    $uibModal, 
    $stateParams,
    $state,
    OrderService, 
    CategoryService, 
    ReceiptService,
    DTOptionsBuilder, 
    DTColumnBuilder){

	// $scope.$watch('receiptForm.sales', function(sales){
 //        if($scope.receiptForm){
 //            if(!isNaN(parseFloat(sales * 0.12))){
 //                //console.log((sales * 0.12).toFixed(2));
 //                //$scope.orderForm.vat = parseFloat((sales * 0.12).toFixed(2));
 //                $scope.receiptForm.vat = (sales * 0.12);
 //            }

 //            computeFinalAmount(sales);
 //        }
 //    });

    $scope.$watch('receiptForm.amount', function(amount){
        if(!isNaN(parseFloat(amount / 1.12))){
            $scope.receiptForm.sales = Number(parseFloat(amount / 1.12).toFixed(2));
        }

        computeFinalAmount(amount);
    });

    // var computeFinalAmount = function(sales){
    //     if(!isNaN(parseFloat(sales + $scope.receiptForm.vat))){
    //         var discount = parseFloat($scope.receiptForm.discount);
    //         var amountDiscounted = 0;

    //         // if(discount && discount > 0 && discount <= 100){
    //         if(discount && discount > 0 && discount <= sales){
    //             //amountDiscounted = sales * ( discount / 100 );
    //             amountDiscounted = discount;
    //         }

    //         var befDC = (sales + parseFloat($scope.receiptForm.vat));
    //         var afterDC = parseFloat(befDC) - parseFloat(amountDiscounted);
    //         $scope.receiptForm.amount = afterDC;
    //     }
    // }

    var computeFinalAmount = function(amount){
        if(!isNaN(parseFloat(amount - $scope.receiptForm.sales))){
            var discount = parseFloat($scope.receiptForm.discount);
            var amountDiscounted = 0;

            // if(discount && discount > 0 && discount <= 100){
            if(discount && discount > 0 && discount <= amount){
                //amountDiscounted = sales * ( discount / 100 );
                amountDiscounted = discount;
            }

            //var befDC = (sales + parseFloat($scope.receiptForm.vat));
            //var afterDC = parseFloat(befDC) - parseFloat(amountDiscounted);
            //$scope.receiptForm.amount = afterDC;

            var totalAmount = parseFloat(amount) + parseFloat(amountDiscounted);
            $scope.receiptForm.sales = Number(parseFloat(totalAmount / 1.12).toFixed(2));
            $scope.receiptForm.vat = Number(parseFloat(totalAmount - $scope.receiptForm.sales).toFixed(2));
        }
    }
});

akitaApp.directive('limitCheck', function(){
    return {
        require: 'ngModel',
        link: function(scope, elem, attrs, ctrl){
            elem.on('keyup', function(){
                scope.$apply(function(){
                    var discount = elem.val();
                    var amount = scope.receiptForm.amount;
                    ctrl.$setValidity('notLimitExcedeed', true);
                    //if(discount > 100){
                    if(discount > amount){
                        ctrl.$setValidity('notLimitExcedeed', false);
                    }else{
                        // if(!isNaN(parseFloat(sales + scope.receiptForm.vat))){
                        //     var discount = parseFloat(scope.receiptForm.discount);
                        //     var amountDiscounted = 0;

                        //     // if(discount && discount > 0 && discount <= 100){
                        //     if(discount && discount > 0 && discount <= sales){
                        //         // amountDiscounted = sales * ( discount / 100 );
                        //         amountDiscounted = discount;
                        //     }

                        //     //scope.receiptForm.amount = (sales + scope.receiptForm.vat - amountDiscounted);
                        //     var befDC = (sales + parseFloat(scope.receiptForm.vat));
                        //     var afterDC = parseFloat(befDC) - parseFloat(amountDiscounted);
                        //     scope.receiptForm.amount = afterDC;
                        // }

                        if(!isNaN(parseFloat(amount - scope.receiptForm.sales))){
                            var discount = parseFloat(scope.receiptForm.discount);
                            var amountDiscounted = 0;

                            // if(discount && discount > 0 && discount <= 100){
                            if(discount && discount > 0 && discount <= amount){
                                // amountDiscounted = sales * ( discount / 100 );
                                amountDiscounted = discount;
                            }

                            //scope.receiptForm.vat = Number(parseFloat(amount - scope.receiptForm.sales).toFixed(2));
                            var totalAmount = parseFloat(amount) + parseFloat(amountDiscounted);
                            scope.receiptForm.sales = Number(parseFloat(totalAmount / 1.12).toFixed(2));
                            scope.receiptForm.vat = Number(parseFloat(totalAmount - scope.receiptForm.sales).toFixed(2));
                        }
                    }
                });
            })
        }
    }
});