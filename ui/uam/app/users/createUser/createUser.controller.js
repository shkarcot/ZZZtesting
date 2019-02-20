module.exports = ['$scope', '$state', '$stateParams', '$rootScope','ngDialog','userService','solutionService','$timeout',
function($scope, $state, $stateParams, $rootScope,ngDialog,userService,solutionService,$timeout) {
    'use strict';
    $rootScope.currentState = 'create user';
    var vm=this;
    $scope.config = {};
    $scope.loginData = JSON.parse(localStorage.getItem('userInfo'));
	vm.sess_id= $scope.loginData.sess_id;
	$scope.id = $stateParams.id;
    var userInfo = JSON.parse(localStorage.getItem('userInfo'));

    solutionService.getSolutions(vm.sess_id).then(function(result){
          $scope.solutionsList=result.data.data;
          if($scope.id != "new"){
              $scope.mapSolutions();
          }
          $timeout($scope.showSelectedSolutions, 600);
    });

    $scope.mapSolutions = function(){
        if($scope.userDetails != undefined && $scope.solutionsList != undefined){
            $scope.config.solutions = [];
            angular.forEach($scope.userDetails[0].solutions, function(value,key){
                var ar = $scope.solutionsList.filter(function(e){if(e.solution_name==value.name){return e}});
                $scope.config.solutions.push(ar[0]);
            });
        }
    };

    vm.getUsers = function(){
         userService.getUsers(vm.sess_id).then(function(response){
              if(response.data.status=="success"){
                   $scope.usersList=response.data.result.data;
                   $scope.userDetails = $scope.usersList.filter(function(e){if(e.id==$scope.id){return e}});
                   $scope.config.roles = $scope.userDetails[0].userRoles;
                   $scope.config.userName = $scope.userDetails[0].userName;
                   $scope.mapSolutions();
               }
               else{
                   $scope.usersList=[];
               }
          });
    }

    if($scope.id != "new"){
       vm.getUsers();
    }

    vm.getUserRoles = function(){
         userService.getUserRoles(vm.sess_id).then(function(response){
              if(response.data.status=="success"){
                   $scope.userRoles=response.data.result.data;
                   $timeout($scope.showSelectedRoles, 600);
               }
               else{
                   $scope.userRoles=[];
               }
          });
    }
    vm.getUserRoles();

    $scope.showSelectedRoles=function(){
        angular.element("#multiSelectUserRoles button").triggerHandler("click");
        angular.element("#multiSelectUserRoles button").triggerHandler("click");
    };
    $scope.showSelectedSolutions=function(){
        angular.element("#multiSelectSolution button").triggerHandler("click");
        angular.element("#multiSelectSolution button").triggerHandler("click");
    };


    $scope.create = function(){
        if($scope.config.password == $scope.config.confirmPassword){
            if($scope.id=='new'){
                if($scope.config.solutions)
                    var solArray = $scope.config.solutions.map(function(e){return {"name": e.solution_name,"id": e.solution_id}});
                else
                    var solArray =[];

                if($scope.config.roles)
                    var roleArray =$scope.config.roles.map(function(e){return e.name});
                else
                    var roleArray=[];
                var obj = {
                            "userName": $scope.config.userName,
                            "solutions": solArray,
                            "password": $scope.config.password,
                            "roles": roleArray
                           }
                console.log(obj);
                userService.createUsers(obj,vm.sess_id).then(function(result){
                            if(result.data.result.status =='Success'){
                                 $.UIkit.notify({
                                    message : result.data.result.message,
                                    status  : 'success',
                                    timeout : 2000,
                                    pos     : 'top-center'
                                 });
                                 $state.go('app.users');
                            }
                            else{
                               $.UIkit.notify({
                                   message :  result.data.result.message,
                                   status  : 'danger',
                                   timeout : 2000,
                                   pos     : 'top-center'
                                });
                            }
                });
            }
            else{
               var solArray = $scope.config.solutions.map(function(e){return {"name": e.solution_name,"id": e.solution_id}});
               var roleArray = $scope.config.roles.map(function(e){return e.name});
               $scope.userDetails[0].userRoles = angular.copy($scope.config.roles);
               $scope.userDetails[0].roles = angular.copy(roleArray);
               $scope.userDetails[0].solutions = angular.copy(solArray);
               $scope.userDetails[0].userName = angular.copy($scope.config.userName);
                userService.createUsers($scope.userDetails[0],vm.sess_id).then(function(result){
                            if(result.data.result.status =='Success'){
                                 $.UIkit.notify({
                                    message : result.data.result.message,
                                    status  : 'success',
                                    timeout : 2000,
                                    pos     : 'top-center'
                                 });
                                 $state.go('app.users');
                            }
                            else{
                               $.UIkit.notify({
                                   message :  result.data.result.message,
                                   status  : 'danger',
                                   timeout : 2000,
                                   pos     : 'top-center'
                                });
                            }
                });
            }
        }
        else{
            $.UIkit.notify({
               message : "Password and confirm password should be match",
               status  : 'danger',
               timeout : 2000,
               pos     : 'top-center'
            });
        }
    };





}];