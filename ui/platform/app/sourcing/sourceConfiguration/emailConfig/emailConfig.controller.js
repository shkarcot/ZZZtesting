module.exports = ['$scope','$state','$rootScope','Upload','$location','ngDialog','$timeout','sourceConfigService','emailConfigData','$window','entitiesService',function($scope,$state,$rootScope,Upload,$location,ngDialog,$timeout,sourceConfigService,emailConfigData,$window,entitiesService) {
	'use strict';
     var vm = this;
      var url = $location.path();
      var arr = url.split("/");
      window.scrollTo(0,0);
      $rootScope.currentState = 'emailConfig';
      $rootScope.$broadcast('breadcrumbObj',$state.current.breadcrumb);
      $scope.loginData = JSON.parse(localStorage.getItem('userInfo'));

      $scope.getAttribute = function(name){
          $scope.listOfAttributes=[];
          $scope.listOfAttributes = $scope.entitiesObj[name];
      };

      $scope.config ={};
      $scope.config =emailConfigData.data;

      if($scope.config == "null"){
        $scope.config ={};
      }

      $scope.getDomainObjects = function(){
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
      $scope.getDomainObjects();

      $scope.uploadHeight = $window.innerHeight-180;

      $scope.resetData = function(){
        $scope.config={};
      };


      $scope.saveConfiguration = function(){
        $scope.isDisable = true;
        $scope.config.email_body = $scope.config.entity+'.'+$scope.config.attribute;
        delete $scope.config["entity"];
        delete $scope.config["attribute"];
        sourceConfigService.saveEmail($scope.config,$scope.loginData.sess_id).then(function(data){
            if(data.data.status=="success"){
              $.UIkit.notify({
                message : data.data.msg,
                status  : 'success',
                timeout : 2000,
                pos     : 'top-center'
              });
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

              $timeout( function(){
                $scope.isDisable = false;
              }, 2000 );


            }
            else{
              $.UIkit.notify({
                message : data.data.msg,
                status  : 'danger',
                timeout : 2000,
                pos     : 'top-center'
              });
              $scope.isDisable = false;
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


}];