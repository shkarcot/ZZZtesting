module.exports = ['$scope','$state','$rootScope','Upload','$location','ngDialog','$timeout','sourceConfigService','$window','entitiesService','multipleEmailConfigService','solutionObj',
function($scope,$state,$rootScope,Upload,$location,ngDialog,$timeout,sourceConfigService,$window,entitiesService,multipleEmailConfigService,solutionObj) {
	'use strict';
     var vm = this;
     vm.mode = 'fun'; //Lets test if property name is set to Rahil
      var url = $location.path();
      var arr = url.split("/");
      window.scrollTo(0,0);

      $scope.showBtnSave=true;

      $rootScope.currentState = 'multipleEmailConfig';
      $rootScope.$broadcast('breadcrumbObj',$state.current.breadcrumb);
      $scope.loginData = JSON.parse(localStorage.getItem('userInfo'));
       if($scope.loginData.user==undefined){
                $scope.loginData.user = {}
                $scope.loginData.user.solution_name = "";
                $scope.loginData.user.solution_id = "";
       }

      $scope.loginData.user.solution_id=solutionObj.solutionId;
      vm.loginData=$scope.loginData;

      $scope.addEmailConfig = function(){
        $scope.showBtnSave=true;
        vm.config={};
        document.getElementById("emailConfigView").style.width = "40%";
      }
      $scope.cancelEmailConfig = function(){
        vm.config={};
        document.getElementById("emailConfigView").style.width = "0%";
      };


      vm.multipleEmailConfigs=[];
      vm.config ={};
      //vm.multipleEmailConfigs=emailConfigData.data;
      //vm.multipleEmailConfigs=[{"subject" : "test2","password" : "1234cogx1234","port" : 993,"email" : "testcogx@gmail.com","host" : "imap.gmail.com"}]

      if(vm.config == "null"){
        vm.config ={};
      }
      vm.getEmailConfigs = function(){
        var req={"solutionId":solutionObj.solutionId};
        multipleEmailConfigService.getMultipleEmailConfigs(req, solutionObj.caseManagementApiUrl).then(function(data){
            if(data.data.status=="success"){

                vm.multipleEmailConfigs=data.data.data;

            }else   {

              $.UIkit.notify({
                 message : data.data.message,
                 status  : 'warning',
                 timeout : 3000,
                 pos     : 'top-center'
              });

            }
        },function(err){
             //$scope.isDisabled = false;
             $.UIkit.notify({
                 message : "Internal server error",
                 status  : 'danger',
                 timeout : 3000,
                 pos     : 'top-center'
             });
        });
      };
      vm.getEmailConfigs();

      /*$scope.getDomainObjects = function(){
        entitiesService.getDomainObjects({'sess_id':vm.sess_id}).then(function(resp){
              console.log(resp.data);
              $scope.entitiesList = resp.data;
              $scope.entitiesObj =  $scope.entitiesList;
              $rootScope.$broadcast('entitiesList',{"data": $scope.entitiesList});
              if($scope.config.email_body != undefined){
                  var str = $scope.config.email_body;
                  var strLength = str.length;
                  var split = str.split('.');
                  var attrLength = split[split.length-1].length;
                  var finalStr =  strLength-attrLength-1;
                  var res = str.substring(finalStr,0);
                  $scope.config.entity = res;
                  $scope.config.attribute = split[split.length-1];
              }
              $scope.listOfAttributes = $scope.entitiesObj[$scope.config.entity];
          },function(err){
             console.log(err)
             $.UIkit.notify({
                     message : "Internal server error",
                     status  : 'warning',
                     timeout : 3000,
                     pos     : 'top-center'
             });
           });
      };
      $scope.getDomainObjects();*/

      $scope.uploadHeight = $window.innerHeight-180;

      vm.resetData = function(){
        vm.config={};
        vm.config.email="";
      };
      vm.cancelEmailConfig = function(){
        $state.go("dashboard");
      };

      vm.selectedEmailconfigData={};

      vm.showUpdateEmailConfigView=function(emailConfig){
        vm.selectedEmailconfigData=emailConfig;
        vm.config.subject=emailConfig.subject;
        vm.config.host=emailConfig.mail_imaps_host;
        vm.config.port=parseInt(emailConfig.mail_imaps_port, 10);
        vm.config.email=emailConfig.mail_user;
        vm.config.password=emailConfig.mail_password;

        $scope.showBtnSave=false;
        document.getElementById("emailConfigView").style.width = "40%";
      };
      vm.isDisableUpdateBtn = false;

      vm.updateEmailConfig=function(){
        $scope.showBtnSave=false;
        vm.isDisableUpdateBtn = true;
        var req={};
            req=vm.config;
            req.id=vm.selectedEmailconfigData._id;
            req.solutionId=solutionObj.solutionId;

        multipleEmailConfigService.updateMultipleEmailConfig(req,$scope.loginData.sess_id,solutionObj.caseManagementApiUrl).then(function(data){
            vm.isDisableUpdateBtn = false;
            if(data.data.status=="success"){
                vm.getEmailConfigs();
                $.UIkit.notify({
                    message : data.data.message,
                    status  : 'success',
                    timeout : 2000,
                    pos     : 'top-center'
                });
                vm.resetData();
                $scope.cancelEmailConfig();
            }
            else{
                $.UIkit.notify({
                    message : data.data.message,
                    status  : 'danger',
                    timeout : 2000,
                    pos     : 'top-center'
                });
            }

        },function(err){
             vm.isDisableUpdateBtn = false;
             console.log(err);
             $.UIkit.notify({
                 message : "Internal server error",
                 status  : 'warning',
                 timeout : 3000,
                 pos     : 'top-center'
             });
        });
      };


      vm.deleteEmailConfig=function(emailConfig){
        //alert("deleteEmailConfig=>", emailConfig);
          ngDialog.open({ template: 'confirmBox', controller: ['$scope','$state' ,function($scope,$state) {
          $scope.activePopupText = "Are you sure you want to delete " +emailConfig.mail_user+ " ?";
          $scope.onConfirmActivation = function (){
            ngDialog.close();

            var solutionId=solutionObj.solutionId;
            var req={"id":emailConfig._id, "solutionId":solutionId}
            multipleEmailConfigService.deleteMultipleEmailConfig(req,vm.loginData.sess_id,solutionObj.caseManagementApiUrl).then(function(resp){
                if(resp.data.status=="success"){
                    $.UIkit.notify({
                        message : resp.data.message,
                        status  : 'success',
                        timeout : 2000,
                        pos     : 'top-center'
                    });
                    vm.resetData();
                    vm.getEmailConfigs();
                }
                else{
                    $.UIkit.notify({
                        message : resp.data.message,
                        status  : 'danger',
                        timeout : 2000,
                        pos     : 'top-center'
                    });
                }

            },function(err){
                  console.log(err);
                 $.UIkit.notify({
                     message : "Internal server error",
                     status  : 'warning',
                     timeout : 3000,
                     pos     : 'top-center'
                 });
            });
           };
        }]
        });
      };

      vm.saveConfiguration = function(){
        vm.isDisable = true;
        vm.config.solutionId=solutionObj.solutionId;
        multipleEmailConfigService.saveMultipleEmailConfig(vm.config,$scope.loginData.sess_id, solutionObj.caseManagementApiUrl).then(function(data){
            vm.isDisable = false;
            if(data.data.status=="success"){
                vm.getEmailConfigs();
                $.UIkit.notify({
                    message : "Email config has been created successfully",
                    status  : 'success',
                    timeout : 2000,
                    pos     : 'top-center'
                });
                vm.resetData();
                $scope.cancelEmailConfig();
            }
            else{
                $.UIkit.notify({
                    message : data.data.message,
                    status  : 'danger',
                    timeout : 2000,
                    pos     : 'top-center'
                });
            }

        },function(err){
            vm.isDisable = false;
              console.log(err);
             $.UIkit.notify({
                 message : "Internal server error",
                 status  : 'warning',
                 timeout : 3000,
                 pos     : 'top-center'
             });
        });
      };
      $scope.setpassword=function(password){
        var str="";
        for(var i=0; i<password.length; i++){
            str+="x";
        }
        return str;
      };
}];