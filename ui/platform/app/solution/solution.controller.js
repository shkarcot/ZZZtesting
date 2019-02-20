module.exports = ['$scope', '$state', '$rootScope', 'solutionService','ngDialog' ,function($scope, $state, $rootScope, solutionService,ngDialog) {
	'use strict';
	  $scope.solutionType = "";
      $rootScope.currentState = 'solution';
      $scope.classSolutionType={};
      $scope.imgSolutionType={};
      var vm = this;
      $scope.showDeleteIcon=[];
      window.scrollTo(0,0);

      $scope.logout =function(){

            localStorage.clear();
            window.location.href = "http://"+ location.host+"/logout";
        };

      $scope.loginData = JSON.parse(localStorage.getItem('userInfo'));
      vm.sess_id= $scope.loginData.sess_id;
      $rootScope.inSolution = false;
      $rootScope.$broadcast('breadcrumbObj',$state.current.breadcrumb);

      vm.getSolutions = function(){
          solutionService.getSolutions(vm.sess_id).then(function(result){
              if(result.data.status == "success"){
                  $scope.solutionsList=result.data.data;
              }
              else{
                  $.UIkit.notify({
                       message : "Failed to get solutions",//'Solution name has not been updated',
                       status  : 'danger',
                       timeout : 2000,
                       pos     : 'top-center'
                  });
              }
          },function(){
              $.UIkit.notify({
                   message : "Internal server error",//'Solution name has not been updated',
                   status  : 'danger',
                   timeout : 2000,
                   pos     : 'top-center'
              });
          });
      };

      vm.getSolutions();

      $scope.solutionSelection = function(obj){
         console.log(obj);
         var userData=localStorage.getItem('userInfo');
         userData=JSON.parse(userData);
         if(userData.user==undefined){
            userData.user = {}
         }
         userData.user.solution_id = obj.solution_id;
         userData.user.solution_name = obj.solution_name;
         if(obj.hocr_type != undefined){
            userData.user.hocr_type = obj.hocr_type;
         }
         solutionService.postTenants({"solution_id":obj.solution_id},vm.sess_id).then(function(result){
            if(result.data.status=="success"){
               $rootScope.solutionName=obj.solution_name;
               $rootScope.inSolution = true;
               userData.solutionName =  obj.solution_name;
               localStorage.removeItem('solutionName');
               localStorage.setItem('solutionName',obj.solution_name);
               localStorage.setItem('userInfo',JSON.stringify(userData));
               $state.go("dashboard");
            }
            else{
              $.UIkit.notify({
                   message : result.data.msg,//'Solution name has not been updated',
                   status  : 'danger',
                   timeout : 2000,
                   pos     : 'top-center'
              });
            }
         },function(){
            $.UIkit.notify({
                   message : "Internal server error",//'Solution name has not been updated',
                   status  : 'danger',
                   timeout : 2000,
                   pos     : 'top-center'
            });
         });
      };

      $scope.deleteSolution = function(list,$event){
          $event.stopPropagation();
          var data = {"solution_id":list.solution_id};
          ngDialog.open({ template: 'confirmBox',
            controller: ['$scope','$state' ,function($scope,$state) {
                $scope.activePopupText = 'Are you sure you want to delete ' +"'" +list.solution_name+ "'" +' ' + 'solution ?';
                $scope.onConfirmActivation = function (){
                    ngDialog.close();
                    solutionService.delSolution(data,vm.sess_id).then(function(result){
                        if(result.data.status=="success"){
                           $.UIkit.notify({
                               message : result.data.msg,
                               status  : 'success',
                               timeout : 2000,
                               pos     : 'top-center'
                            });
                            vm.getSolutions();
                        }
                        if(result.data.status=="failure"){
                           $.UIkit.notify({
                               message : result.data.msg,
                               status  : 'danger',
                               timeout : 2000,
                               pos     : 'top-center'
                            });
                        }
                    },function(){
                          $.UIkit.notify({
                               message : 'Internal server error',
                               status  : 'danger',
                               timeout : 2000,
                               pos     : 'top-center'
                          });

                    });
                };
            }]
          });
      };

      $scope.showDeleteSolution=function(index){
        $scope.showDeleteIcon[index]=true;
      };
      $scope.hideDeleteSolution=function(index){
        $scope.showDeleteIcon[index]=false;
      };

}];