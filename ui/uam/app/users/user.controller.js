module.exports = ['$scope','$state','solutionService','userService','$rootScope','ngDialog',function($scope,$state,solutionService,userService,$rootScope,ngDialog) {
	'use strict';

	var vm = this;
	window.scrollTo(0,0);
	$rootScope.currentState = 'users';
	$scope.loginData = JSON.parse(localStorage.getItem('userInfo'));
	vm.sess_id= $scope.loginData.sess_id;
	$scope.config = {};
	$scope.config.solution = [];
	var userInfo = JSON.parse(localStorage.getItem('userInfo'));


    solutionService.getSolutions(vm.sess_id).then(function(result){
          $scope.solutionsList=result.data.data;
    });
    $scope.usersList=[];
    vm.getUsers = function(){
         userService.getUsers(vm.sess_id).then(function(response){
              if(response.data.status=="success"){
                   $scope.usersList=response.data.result.data;
               }
               else{
                   $scope.usersList=[];
               }
          });
    }

    vm.getUsers();

    $scope.createUser = function(){
        $state.go('app.createUser',{id:'new'});
    };

    $scope.editUser = function(user){
        $state.go('app.createUser',{id: user.id});
    };



    $scope.deleteUser = function(obj){
       ngDialog.open({ template: 'confirmBox',
            controller: ['$scope','$state' ,function($scope,$state) {
                $scope.activePopupText = 'Are you sure you want to delete ' +"'" +obj.userName+ "'" +' ' + 'name ?';
                $scope.onConfirmActivation = function (){
                    ngDialog.close();
                    userService.deleteUser({"id":obj.id},vm.sess_id).then(function(result){
                        if(result.data.status=="success"){
                           $.UIkit.notify({
                               message : result.data.msg,
                               status  : 'success',
                               timeout : 2000,
                               pos     : 'top-center'
                           });

                           vm.getUsers();


                        }
                        if(result.data.status=="failure"){
                           $.UIkit.notify({
                               message : result.data.msg,
                               status  : 'danger',
                               timeout : 2000,
                               pos     : 'top-center'
                            });
                        }
                    },function(err){
                       $.UIkit.notify({
                               message : 'Internal Server Error',
                               status  : 'warning',
                               timeout : 2000,
                               pos     : 'top-center'
                       });
                    });
                };
            }]
       });

    };
}];