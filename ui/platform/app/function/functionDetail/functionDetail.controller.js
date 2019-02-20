    module.exports = ['$scope', '$state', '$rootScope', 'functionDetailService', '$stateParams', 'ngDialog', '$sce',
function($scope, $state,$rootScope,functionDetailService,$stateParams,ngDialog,$sce) {
	'use strict';
	  var vm = this;
	  $scope.loginData = JSON.parse(localStorage.getItem('userInfo'));
      var userData=localStorage.getItem('userInfo');
      userData=JSON.parse(userData);
      vm.sess_id = userData.sess_id;
      $scope.showEditIcons = [];
      $scope.enableTestSpin = [];
      $scope.seeLogsShow = [];
      vm.functionName = $stateParams.name;

      vm.getFunctionDetail = function(){
            functionDetailService.getFunctionDetail({'sess_id':vm.sess_id,'name': vm.functionName}).then(function(response){
                if(response.data.status=="success"){
                    vm.functionDetail = response.data.data[0];
                    vm.allVersions = response.data.data[0].versions;
                }
                else{
                    $.UIkit.notify({
                       message : response.data.msg,
                       status  : 'warning',
                       timeout : 3000,
                       pos     : 'top-center'
                    });
                }
            },function(err){
                console.log("error----"+err.error);
            });
      };

      vm.getFunctionDetail();

      $scope.showIcons=function(index){
            $scope.showEditIcons[index]=true;
      };
      $scope.hideIcons=function(index){
            $scope.showEditIcons[index]=false;
      };

      vm.setActiveToVersion = function(obj){
            var reqObj={'function_name':vm.functionName,"function_version":obj.version,"is_active":obj.is_active};
            functionDetailService.enableVersion({'sess_id':vm.sess_id,"data":reqObj}).then(function(response){
                if(response.data.status=="success"){
                    vm.getFunctionDetail();
                    $.UIkit.notify({
                       message : response.data.msg,
                       status  : 'success',
                       timeout : 3000,
                       pos     : 'top-center'
                    });
                }
                else{
                    $.UIkit.notify({
                       message : response.data.msg,
                       status  : 'warning',
                       timeout : 3000,
                       pos     : 'top-center'
                    });
                    obj.is_active = !obj.is_active;
                }
            },function(err){
                $.UIkit.notify({
                   message : "Internal server error",
                   status  : 'danger',
                   timeout : 3000,
                   pos     : 'top-center'
                });
                obj.is_active = !obj.is_active;
            });
      };

      vm.deleteVersionFunct = function(obj){
            var reqObj={'function_name':vm.functionName,"function_version":obj.version};
            ngDialog.open({ template: 'confirmBox',
                  controller: ['$scope','$state' ,function($scope,$state) {
                      $scope.popUpText = "Do you really want to delete the version?";
                      $scope.onConfirmActivation = function (){
                          functionDetailService.deleteVersion({'sess_id':vm.sess_id,"data":reqObj}).then(function(response){
                                if(response.data.status=="success"){
                                    ngDialog.close();
                                    vm.getFunctionDetail();
                                    $.UIkit.notify({
                                       message : response.data.msg,
                                       status  : 'success',
                                       timeout : 3000,
                                       pos     : 'top-center'
                                    });
                                }
                                else{
                                    $.UIkit.notify({
                                       message : response.data.msg,
                                       status  : 'warning',
                                       timeout : 3000,
                                       pos     : 'top-center'
                                    });

                                }
                          },function(err){
                                $.UIkit.notify({
                                   message : "Internal server error",
                                   status  : 'danger',
                                   timeout : 3000,
                                   pos     : 'top-center'
                                });
                          });
                      };
                  }]
            });
      };

      vm.testVersionFunct = function(obj,index,params){
            var reqObj={'function_name':vm.functionName,"function_version":obj.version,"params": params};
            $scope.enableTestSpin[index] = true;
            $scope.seeLogsShow = [];
            $scope.successShow = [];
            $scope.cancelTest();
            functionDetailService.testVersion({'sess_id':vm.sess_id,"data":reqObj}).then(function(response){
                if(response.data.status=="success"){
                    $scope.enableTestSpin[index] = false;
                    $scope.testResult = response.data.data;
                    if($scope.testResult.code == 500){
                        $scope.seeLogsShow[index] = true;
                    }
                    else{
                        $scope.successShow[index] = true;
                    }
                }
                else{
                    $.UIkit.notify({
                       message : response.data.msg,
                       status  : 'warning',
                       timeout : 3000,
                       pos     : 'top-center'
                    });
                    $scope.enableTestSpin[index] = false;
                }
            },function(err){
                $.UIkit.notify({
                   message : "Internal server error",
                   status  : 'danger',
                   timeout : 3000,
                   pos     : 'top-center'
                });
                $scope.enableTestSpin[index] = false;
            });
      };

      vm.editVersionFunct = function(obj,prop){
            var reqObj={'function_name':vm.functionName,"function_version":obj.version};
            if(prop == 'fork')
                reqObj.is_fork = true;
            else
                reqObj.is_fork = false;
            vm.selectedVersionObj = angular.copy(obj);
            functionDetailService.openVersion({'sess_id':vm.sess_id,"data":reqObj}).then(function(response){
                if(response.data.status=="success"){
                    $scope.functionOpenResp = response.data.data;
                    $scope.jupiterUrl = $sce.trustAsResourceUrl($scope.functionOpenResp.jupyter_url);
                    $scope.jupiterNotebook = true;
                }
                else{
                    $.UIkit.notify({
                       message : response.data.msg,
                       status  : 'warning',
                       timeout : 3000,
                       pos     : 'top-center'
                    });

                }
            },function(err){
                $.UIkit.notify({
                   message : "Internal server error",
                   status  : 'danger',
                   timeout : 3000,
                   pos     : 'top-center'
                });
            });
      };

      vm.saveFunctionVersion = function(){
            var reqObj={'function_name':$scope.functionOpenResp.function_name,"function_version":$scope.functionOpenResp.version};
            $scope.enableJupiterLoader = true;
            functionDetailService.saveVersion({'sess_id':vm.sess_id,"data":reqObj}).then(function(response){
                if(response.data.status=="success"){
                    $scope.jupiterNotebook = false;
                    vm.getFunctionDetail();
                    $.UIkit.notify({
                       message : "Saved successfully",
                       status  : 'success',
                       timeout : 3000,
                       pos     : 'top-center'
                    });
                    $scope.enableJupiterLoader = false;
                }
                else{
                    $.UIkit.notify({
                       message : response.data.msg,
                       status  : 'warning',
                       timeout : 3000,
                       pos     : 'top-center'
                    });
                    $scope.enableJupiterLoader = false;
                }
            },function(err){
                $.UIkit.notify({
                   message : "Internal server error",
                   status  : 'danger',
                   timeout : 3000,
                   pos     : 'top-center'
                });
                $scope.enableJupiterLoader = false;
            });
      };

      vm.publishVersionFunct = function(list){
            var reqObj={'function_name':vm.functionName,"function_version":list.version};
            functionDetailService.publishVersion({'sess_id':vm.sess_id,"data":reqObj}).then(function(response){
                if(response.data.status=="success"){
                    $.UIkit.notify({
                       message : response.data.msg,
                       status  : 'success',
                       timeout : 3000,
                       pos     : 'top-center'
                    });
                }
                else{
                    $.UIkit.notify({
                       message : response.data.msg,
                       status  : 'warning',
                       timeout : 3000,
                       pos     : 'top-center'
                    });

                }
            },function(err){
                $.UIkit.notify({
                   message : "Internal server error",
                   status  : 'danger',
                   timeout : 3000,
                   pos     : 'top-center'
                });
            });
      };

      vm.backClick = function(){
            $scope.jupiterNotebook = false;
      };

      $scope.cancelLogs = function () {
            document.getElementById("logsPanel").style.width = "0%";
      };

      vm.checkForLogs = function(list){
            document.getElementById("logsPanel").style.width = "40%";
//            var reqObj={'function_name':vm.functionName,"function_version":list.version,"exec_id": $scope.testResult.exec_id};
//            functionDetailService.checkLogs({'sess_id':vm.sess_id,"data":reqObj}).then(function(response){
//                if(response.data.status=="success"){
//
//                }
//                else{
//                    $.UIkit.notify({
//                       message : response.data.msg,
//                       status  : 'warning',
//                       timeout : 3000,
//                       pos     : 'top-center'
//                    });
//                }
//            },function(err){
//                $.UIkit.notify({
//                   message : "Internal server error",
//                   status  : 'danger',
//                   timeout : 3000,
//                   pos     : 'top-center'
//                });
//            });
      };

      vm.testVersion = function(list, index){
            $scope.ImportDataset="Test Version";
            $scope.selectedVerForTest = angular.copy(list);
            $scope.selectedIndexForTest = angular.copy(index);
            document.getElementById("testVersionDiv").style.width = "40%";
      };

      $scope.cancelTest = function () {
            document.getElementById("testVersionDiv").style.width = "0%";
            vm.testParams = "";
            $scope.errMsgJsonValidator = "";
      };

      function IsValidJSONString(str) {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
      }

      vm.sendTestVersion = function(){
            if(IsValidJSONString(vm.testParams)){
                var paramsObj = JSON.parse(vm.testParams);
                vm.testVersionFunct($scope.selectedVerForTest,$scope.selectedIndexForTest,paramsObj);
            }
            else{
                $scope.errMsgJsonValidator = "Invalid Json Format";
            }
      };


}];