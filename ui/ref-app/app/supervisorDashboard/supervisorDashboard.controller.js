module.exports = ['$scope','$state','$compile','$timeout', '$rootScope','$sce','$location','agentDashboardService', function($scope,$state,$compile,$timeout,$rootScope,$sce,$location,agentDashboardService) {
	  'use strict';

	  var vm = this;
      var url = $location.path();
      window.scrollTo(0,0);
      $rootScope.currentState = 'supervisorDashboard';
      $scope.loginData = JSON.parse(localStorage.getItem('userInfo'));
      vm.sess_id= $scope.loginData.sess_id;

      vm.getSession = function(){
         agentDashboardService.getSessionData().then(function(response){
               if(response.data.logged_in){
                if(response.data.role!='bu' && response.data.role!='sv'){
                  window.location.href = "http://"+ location.host+"/";
                }
                else{
                  if(response.data.user == undefined){
                      response.data.user = {};
                  }
                  response.data.user.role = response.data.role;
                  response.data.solutionName =  $scope.loginData.solutionName;
                  response.data.solutionId =  $scope.loginData.solutionId;
                  localStorage.setItem('userInfo',JSON.stringify(response.data));
                  $scope.loginData = JSON.parse(localStorage.getItem('userInfo'));
                  $rootScope.$broadcast('userBroadcast', { username: response.data.username });
                  vm.sess_id= $scope.loginData.sess_id;
                  vm.getQueues();
                }
              }
              else{
                 localStorage.clear();
              }
         });
      };
      vm.getSession();

      vm.getQueues = function(){
          if($scope.loginData.username != undefined){
              var reqObj = {'solution_id': $scope.loginData.solutionId,
                  'data':{'user_id':$scope.loginData._id,
                           'role': $scope.loginData.role,
                              'user_name': $scope.loginData.username,
                              'filter_obj': {"page_no":1,
                             "no_of_recs":8,
                             "sort_by":"updated_ts",
                             "order_by":false
                            }
                     }
              };
              agentDashboardService.getDashboardQueues(reqObj,vm.sess_id,$scope.loginData.accesstoken).then(function(data){
                       if(data.data.status.success){
                            vm.allQueues = data.data.metadata.queues;
                            vm.dashboardStats = data.data.stats;
                       }
                       else{
                             $.UIkit.notify({
                                       message : data.data.status.msg,
                                       status  : 'danger',
                                       timeout : 3000,
                                       pos     : 'top-center'
                             });
                       }
                },function(err){
                   $.UIkit.notify({
                           message : "Internal server error",
                           status  : 'warning',
                           timeout : 3000,
                           pos     : 'top-center'
                   });
                });
           }
      };

      vm.getQueues();

      vm.goToQueueCases = function(arr){
          $rootScope.queueName = arr.name;
          localStorage.setItem("queueName", $rootScope.queueName);
          if(arr.user_groups != undefined){
            localStorage.setItem("userGroups", JSON.stringify(arr));
          }
          $state.go("app.supervisorDocumentsList",{"id":arr.id});
      };

}];