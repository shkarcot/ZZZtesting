'use strict';

/**
 * @ngdoc function
 * @name platformConsoleApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the platformConsoleApp
 */
angular.module('console.engine.Insights')
  .config(function($provide) {
      $provide.decorator('$state', function($delegate, $stateParams) {
          $delegate.forceReload = function() {
              return $delegate.go($delegate.current, $stateParams, {
                  reload: true,
                  inherit: false,
                  notify: true
              });
          };
          return $delegate;
      });
  })
  .controller('defineInsightsCtrl', function ($scope,$state,$rootScope,$location,insightsConfigurationServices) {
      var vm = this;
      $rootScope.$broadcast('breadcrumbObj',$state.current.breadcrumb);
      $scope.loginData = JSON.parse(localStorage.getItem('userInfo'));
      $scope.date=new Date();
      vm.insightSelectError="";
      vm.spinGetInsightData=true;
      vm.isDisabled=false;
      vm.spinGetInsightInOutPutData=false;
      vm.inputData=[];
      vm.outputData={};
      vm.spinConfigure=false;

      vm.getInsightData =function(type,id){
        vm.spinGetInsightData=false;
        var obj={"sess_id":$scope.loginData.sess_id};
        insightsConfigurationServices.getInsights(obj).then(function(response){
          if(response.data.status=="success"){
            vm.insightObj=response.data.data;
            console.log(vm.insightObj);
            setTimeout(function(){
             angular.element(document.getElementById('sel-insights')).triggerHandler('change');
            }, 500);
          }
        });
      };
      vm.getInsightData();

      vm.selectInsight =function(selectedInsightKey){
        vm.inputData=[];
        vm.outputData={};
        if(selectedInsightKey!=""){
          var obj=vm.insightObj[selectedInsightKey];
          vm.spinGetInsightInOutPutData=false;
          //obj=JSON.parse(obj);
          vm.messageForKeyEmpty = "";
          angular.forEach(obj.template_value.input.schema.properties.data.properties,function(value,key){
              vm.inputData.push({"key":key,"type":value.ui_type,"default":true});
          });
//          if(vm.inputData.length == 1){
//            if(vm.inputData[0].key != "request_type"){
//              vm.outputData=obj.template_value.output.schema.properties.metadata.properties;
//            }
//          }
//          else{
            vm.outputData=obj.template_value.output.schema.properties.metadata.properties;
          //}
        }
        else{
          vm.insightSelectError="";
          vm.inputData={};
          vm.outputData={};
        }
      };

      vm.addInputKeys=function(){
        var len = vm.inputData.length-1;

        if(vm.inputData[len] != undefined){
          if(vm.inputData[len].key != '' || len == 0){
            vm.inputData.push({"key":"","type":"string","default":false});
            vm.messageForKeyEmpty = "";
          }
          else{
            vm.messageForKeyEmpty = "Please enter key name";
          }
        }
        else{
            vm.inputData.push({"key":"","type":"string","default":false});
            vm.messageForKeyEmpty = "";
        }
      };

      vm.keyEmptyCheck=function(val,index){
        if(val!="")
          vm.messageForKeyEmpty="";
        else
          vm.messageForKeyEmpty = "Please enter key name";
        //angular.element(document.getElementById(index)).removeClass("notEmpty");
      };

      vm.configureInsight=function(){
        if(vm.selectedInsight!=""){
          vm.spinConfigure=true;
          var reqObj={"template_key":vm.insightObj[vm.selectedInsight].template_key,"template_value":vm.insightObj[vm.selectedInsight].template_value};
          angular.forEach(vm.inputData,function(value,key){
             if(value.default!=true){
                reqObj.template_value.input.schema.properties.data.properties[value.key]={"type": "string","ui_type": value.type};
             }
          });
          var req={"sess_id":$scope.loginData.sess_id,"data":reqObj};
          insightsConfigurationServices.configureInsight(req).then(function(response){
            if(response.data.status=="success"){
              $.UIkit.notify({
                message : response.data.msg,
                status  : 'success',
                timeout : 2000,
                pos     : 'top-center'
              });
              //vm.getInsightData();
              $state.forceReload();
            }
            else{
              $.UIkit.notify({
                message : response.data.msg,
                status  : 'warning',
                timeout : 2000,
                pos     : 'top-center'
              });
            }
            vm.spinConfigure=false;
          });
        }
      };
  });
