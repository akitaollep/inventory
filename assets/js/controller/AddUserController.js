akitaApp.controller('AddUserController', function(
	$scope, 
    $uibModal, 
    $stateParams,
    $state,
    dialogs,
    UserService){

	$scope.deleteUser = deleteUser;

	function deleteUser(userId){
		var dlg = dialogs.confirm('Delete User', 'Are you sure you want to delete this user?', { size: 'sm' });
		dlg.result.then(function(btn){
			UserService.deleteUser(userId).then(function(response){
		        $scope.closeCreateNewUserForm();
		        $scope.refreshUser();
		    });
		}, function(btn){
			//Do nothing
		});
	}

});