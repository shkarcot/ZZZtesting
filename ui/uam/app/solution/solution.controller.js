module.exports = ['$scope', '$state', '$rootScope', 'solutionService','ngDialog' ,function($scope, $state, $rootScope, solutionService,ngDialog) {
	'use strict';
	  $scope.solutionType = "";
      $rootScope.currentState = 'solution';
      $scope.classSolutionType={};
      $scope.imgSolutionType={};
      $scope.classSolutionType['1']="solutionTypeDiv";
      $scope.classSolutionType['2']="solutionTypeDiv";
      $scope.classSolutionType['3']="solutionTypeDiv";
      $scope.imgSolutionType['1']=false;
      $scope.imgSolutionType['2']=false;
      $scope.imgSolutionType['3']=false;
      var vm = this;
      $scope.showDeleteIcon={};
      $scope.solutionActiveClass = [];
      window.scrollTo(0,0);

      $scope.loginData = JSON.parse(localStorage.getItem('userInfo'));
      vm.sess_id= $scope.loginData.sess_id;
      $rootScope.inSolution = false;
      $rootScope.$broadcast('breadcrumbObj',$state.current.breadcrumb);

      solutionService.getSolutions(vm.sess_id).then(function(result){
          $scope.solutionsList=result.data.data;
          if(result.data.result == undefined){
            $scope.createSolution = true;
            $scope.solutionDash = false;
            $scope.solutionName = "";
          }
          else if($scope.solutionsList.length >= 1){
            $scope.solutionDash = true;
            $scope.createSolution = false;
            for(var i=0;i<$scope.solutionsList.length;i++){
              if($scope.solutionsList[i].solution_id == $scope.loginData.user.solution_id){
                $scope.solutionActiveClass[i] = "wellActiveSolution";
              }
              else{
                $scope.solutionActiveClass[i] = "wellSolution";
              }
            }
          }
//          if($scope.solutionsList.length == 1){
//            $state.go("app.dashboard");
//          }
      });

      $scope.solutionSelection = function(obj){
         var userData=localStorage.getItem('userInfo');
         userData=JSON.parse(userData);
         userData.user.solution_id = obj.solution_id;
         userData.user.solution_name = obj.solution_name;
         solutionService.postTenants({"solution_id":obj.solution_id},vm.sess_id).then(function(result){
            if(result.data.status=="success"){
               $rootScope.solutionName=obj.solution_name;
               $rootScope.inSolution = true;
               $state.go("app.dashboard");
            }
            else{
              $.UIkit.notify({
                   message : result.data.msg,//'Solution name has not been updated',
                   status  : 'danger',
                   timeout : 2000,
                   pos     : 'top-center'
              });
            }
         });
      };

      $scope.createSolutionFunction = function(){
          $scope.solutionType = "automation";
           var obj = {
              "solution_name" : angular.copy($scope.solutionName),
              "solution_type" : $scope.solutionType,
              "description" : $scope.solutionDes
           };
           solutionService.createSolution(obj,vm.sess_id).then(function(result){
                if(result.data.status=="success"){
                     $.UIkit.notify({
                        message : result.data.msg,
                        status  : 'success',
                        timeout : 2000,
                        pos     : 'top-center'
                     });
                     $scope.solutionName = "";
                     $scope.solutionDes = "";
                     $scope.solutionDash = true;
                     $scope.createSolution = false;
                     $scope.setTenantAfterCreate(obj.solution_name);
                     $state.reload();
                }
                else{

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

      $scope.setTenantAfterCreate = function(solName){
         solutionService.getSolutions(vm.sess_id).then(function(result){
            $scope.solutionsList=result.data.data;
            $rootScope.inSolution = true;
//            for(var i=0;i<$scope.solutionsList.length;i++){
//              if($scope.solutionsList[i].solution_name == solName){
//                 var userData=localStorage.getItem('userInfo');
//                 userData=JSON.parse(userData);
//                 userData.user.solution_id = $scope.solutionsList[i].solution_id;
//                 userData.user.solution_name = $scope.solutionsList[i].solution_name;
//                 localStorage.setItem('loginData',JSON.stringify(userData));
//                 var sol_ref_id=$scope.solutionsList[i].solution_id;
//                 /*solutionService.postTenants({"solution_id":sol_ref_id},vm.sess_id).then(function(result){
//                    if(result.data.status=="success"){
//                       $rootScope.solutionName=$scope.solutionsList[i].solution_name;
//                       $rootScope.inSolution = true;
//                       $state.go("app.dashboard");
//                    }
//                    else{
//                      $.UIkit.notify({
//                           message : result.data.msg,//'Solution name has not been updated',
//                           status  : 'danger',
//                           timeout : 2000,
//                           pos     : 'top-center'
//                      });
//                    }
//                 });
//                 break;*/
//              }
//            }
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
                            $state.reload();
                        }
                        else{
                           $.UIkit.notify({
                               message : result.data.msg,
                               status  : 'danger',
                               timeout : 2000,
                               pos     : 'top-center'
                            });
                        }
                    }).catch(function(response) {
                          console.log(response);
                          $.UIkit.notify({
                               message : 'Internal Server Error',
                               status  : 'danger',
                               timeout : 2000,
                               pos     : 'top-center'
                          });
                    });
                };
            }]
          });
      };

      //ng-style="solutionType=='insights' && {'border': '2px solid #25aae1' ,'box-shadow': '1px 1px 1px 1px #f9ecec'} || {}"
      // ng-style="solutionType=='automation' && {'border': '2px solid #25aae1' ,'box-shadow': '1px 1px 1px 1px #f9ecec'} || {}"
      //ng-style="solutionType=='engagement' && {'border': '2px solid #25aae1' ,'box-shadow': '1px 1px 1px 1px #f9ecec'} || {}"
      $scope.solutionTypeChange = function(selection){
        if(selection=='1'){
          $scope.solutionType = "insights";
          $scope.classSolutionType['2']="solutionTypeDiv";
          $scope.classSolutionType['3']="solutionTypeDiv";
          $scope.imgSolutionType['2']=false;
          $scope.imgSolutionType['3']=false;
        }
        if(selection=='2'){
          $scope.solutionType = "automation";
          $scope.classSolutionType['1']="solutionTypeDiv";
          $scope.classSolutionType['3']="solutionTypeDiv";
          $scope.imgSolutionType['1']=false;
          $scope.imgSolutionType['3']=false;
        }
        if(selection=='3'){
          $scope.solutionType = "engagement";
          $scope.classSolutionType['1']="solutionTypeDiv";
          $scope.classSolutionType['2']="solutionTypeDiv";
          $scope.imgSolutionType['1']=false;
          $scope.imgSolutionType['2']=false;
        }
        $scope.classSolutionType[selection]="solutionTypeActiveDiv";
        $scope.imgSolutionType[selection]=true;
      };

      $scope.navigateToCreate = function(){
        $scope.solutionDash = false;
        $scope.createSolution = true;
        $scope.solutionName = "";
      };

      $scope.showDeleteSolution=function(index){
        $scope.showDeleteIcon[index]=true;
      };
      $scope.hideDeleteSolution=function(index){
        $scope.showDeleteIcon[index]=false;
      };

}];