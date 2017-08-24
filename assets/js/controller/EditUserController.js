akitaApp.controller('EditUserController', function(
	$scope, 
    $stateParams,
    $state,
    UserService){

	$scope.userForm = {};
	$scope.submitForm = submitForm;

	function submitForm(){
	    UserService.changePassword($scope.userForm).then(function(response){
	        $state.go('users');
	    });
	}

});