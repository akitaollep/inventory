akitaApp.controller('ListUsersController', function(
    $scope, 
    $uibModal, 
    $stateParams,
    $state,
    $rootScope,
    UserService, 
    RoleService,
    DTOptionsBuilder, 
    DTColumnBuilder){

    $scope.users = [];
    $scope.userForm = {};
    var modalInstance = null;

    if(sessionStorage.isLoggedIn){
        $rootScope.isLoggedIn = Boolean(sessionStorage.isLoggedIn);
    }

    if(sessionStorage.userRole){
        $rootScope.userRole = sessionStorage.userRole;
    }

    console.log($rootScope)

    refreshUser();

    $scope.refreshUser = refreshUser;

    $scope.showSaveUserForm = function(){
        $scope.userForm = {};
        showSaveUserForm();
    };
    $scope.closeCreateNewUserForm = closeCreateNewUserForm;
    $scope.submitForm = submitForm;

    $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('responsive', true).withOption('rowCallback', rowCallback);
    $scope.dtColumns = [
        DTColumnBuilder.newColumn('id').withTitle('ID'),
        DTColumnBuilder.newColumn('email').withTitle('Email'),
        DTColumnBuilder.newColumn('username').withTitle('Username'),
        DTColumnBuilder.newColumn(null).withTitle('Full Name').renderWith(getFullName),
        DTColumnBuilder.newColumn('role').withTitle('Role'),
    ];

    function refreshUser(){
        UserService.getUsers().then(function(response){
            $scope.users = response;
        });
    };

    function rowCallback(nRow, aData, iDisplayIndex, iDisplayIndexFull){
        $('td', nRow).unbind('click');
        $('td', nRow).bind('click', function() {
            $scope.$apply(function() {
                UserService.getUser(aData[0]).then(function(user){
                    $scope.userForm = user;
                    showSaveUserForm();
                });
            });
        });
        return nRow;
    }

    function getFullName(data, type, full, meta){
        return data.firstName + ' ' + data.lastName;
    }

    function showSaveUserForm(){
        UserService.getUserRoles().then(function(response){
            $scope.roles = response;
            modalInstance = $uibModal.open({
                templateUrl: '/templates/users/add.html',
                scope: $scope,
                controller: 'AddUserController'
            });
        });
    }

    function closeCreateNewUserForm(){
        $scope.errorMessage = undefined;
        modalInstance.dismiss('cancel');
    }

    function submitForm(){
        UserService.addUser($scope.userForm).then(function(response){

            if(response instanceof Array){
                $scope.users = response;
            }else{
                $scope.users.push(response);
            }

            $scope.userForm = {};
            modalInstance.close('closed');
        });
    }
});