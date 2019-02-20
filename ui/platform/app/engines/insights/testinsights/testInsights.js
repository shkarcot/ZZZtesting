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
  .controller('testInsightsCtrl', function ($scope,$state,$rootScope,$location,Upload,insightsConfigurationServices) {
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
      vm.spinTestInsight=false;

      vm.testInsightObj={};

      vm.selectedInsightFunction="";

      vm.showLoaderIcon=[];
      vm.browseFileError=[];
      vm.uploadStatus=[];
      vm.fileTypes=['.jpg','.png','.gif'];

      vm.getInsightData =function(type,id){
        vm.inputData=[];
        vm.outputData={};
        vm.spinGetInsightData=false;
        var obj={"sess_id":$scope.loginData.sess_id};
        insightsConfigurationServices.getInsights(obj).then(function(response){
          if(response.data.status=="success"){
            vm.insightObj=response.data.data;
            setTimeout(function(){
             angular.element(document.getElementById('sel-testinsight')).triggerHandler('change');
            }, 500);
          }
        });
      };
      vm.getInsightData();

      vm.selectInsight =function(selectedInsightKey){
        vm.inputData=[];
        vm.outputData={};
        vm.testInsightObj={};
        vm.selectedInsightFunction="";
        vm.ResponseOfTestInsightObj="";
        vm.showLoaderIcon=[];
        vm.browseFileError=[];
        vm.uploadStatus=[];
        if(selectedInsightKey!=""){
          var obj=vm.insightObj[selectedInsightKey];
          vm.selectedInsightFunction=obj.template_key;
          vm.spinGetInsightInOutPutData=false;
          //obj=JSON.parse(obj);
          angular.forEach(obj.template_value.input.schema.properties.data.properties,function(value,key){
              vm.inputData.push({"key":key,"type":value.type,"ui_type":value.ui_type,"default":true});
          });
          vm.outputData=obj.template_value.output.schema.properties.metadata.properties;
        }
        else{
          vm.insightSelectError="";
          vm.inputData={};
          vm.outputData={};
        }
      };

      vm.uploadImage = function(file,key){
        vm.uploadStatus[key]="";
        if(file == undefined || file == null){
             vm.browseFileError[key] = true;
        }
        else {
              vm.showLoaderIcon[key]=true;
              var re = /(?:\.([^.]+))?$/;
              var selectedFileType=file.name;
              var fileExtension = "."+re.exec(file.name)[1];

              if(validateFileType(fileExtension)){
                vm.browseFileError[key]=false;
                vm.testInsightObj[key].file_path= "";

                var dataObj={"name": "","description": $scope.inputModel,"type": $scope.fileType};
                $scope.showLoaderIcon = true;
                file.upload = Upload.upload({
                    url: '/api/upload/',
                    method: 'POST',
                    headers: {"sess_token": $scope.loginData.sess_id},
                    data:dataObj,
                    file: file
                })
                file.upload.then(function (response) {
                  vm.showLoaderIcon[key]=false;
                  vm.browseFileError[key]=false;
                 if(response.data.status=="success"){
                    vm.testInsightObj[key].file_path= response.data.path;
                    vm.uploadStatus[key]="'"+response.config.file.name+"' "+response.data.msg;
                 }
                 else{
                   vm.uploadStatus[key]=response.data.msg;
                 }

                }, function (response) {
                });
              }
              else{
                vm.showLoaderIcon[key]=false;
                $.UIkit.notify({
                   message : "Please upload "+vm.fileTypes[0]+"/"+vm.fileTypes[1]+"/"+vm.fileTypes[2]+"' extension files only",
                   status  : 'warning',
                   timeout : 3000,
                   pos     : 'top-center'
                 });
              }
        }
      };

      function validateFileType(fileExtension){
        var flag=false;
        angular.forEach(vm.fileTypes,function(value,key){
          if(value==fileExtension){
            flag=true;
          }
        });
        return flag;
      };

      vm.testInsight=function(){
        var flag=true;
        var testObj={};
        //vm.ResponseOfTestInsightObj=JSON.stringify({"msg":"Get insight response","data":{"context":{},"insights":[{"result":{"action_summary":[{"platform_intent":"update_entity","entity_value":"","entity_name":"practice_details"}],"actions":[{"intent_confidence":1.0,"intent_verb":"moved","value":null,"platform_intent":"update_entity","verb_confidence":0.9988580273998757,"sentence":"Provider has moved the location of her practice.","entity_name":"practice_details"},{"intent_confidence":1.0,"intent_verb":"update","value":"100 Cedar Oak, Los Angeles, CA 30304","platform_intent":"update_entity","verb_confidence":1.0,"sentence":"Please update address to 100 Cedar Oak, Los Angeles, CA 30304.","entity_name":"practice_details.contact_details.address"},{"intent_confidence":1.0,"intent_verb":"be","value":"657-980-4568","platform_intent":"update_entity","verb_confidence":0.9988580273998757,"sentence":"Phone Number will be 657-980-4568.","entity_name":"practice_details.contact_details.phone"},{"intent_confidence":1.0,"intent_verb":"be","value":"hjamison@anthem.com","platform_intent":"update_entity","verb_confidence":0.9988580273998757,"sentence":"Email will be hjamison@anthem.com.","entity_name":"EMAIL"}]}}]},"status":"success"});
        angular.forEach(vm.testInsightObj,function(obj,key){
           if(obj.type=="image"){
              if(obj.file_path==""){
                //vm.browseFileError[key]=true;
                //flag=false;
                vm.browseFileError[key]=false;
              }
              else{
                testObj[key]=obj.file_path;
              }
           }
           else if(obj.type=="string"){
              if(obj.value==""){
                angular.element(document.getElementById(key)).addClass("notEmpty");
                flag=false;
              }
              else{
                testObj[key]=obj.value;
              }
           }
        });
        vm.ResponseOfTestInsightObj="";
        if(flag==true){
          vm.spinTestInsight=true;

          var reqObj= {"template_key": vm.selectedInsightFunction,"template_value": testObj};
          var req={"sess_id":$scope.loginData.sess_id,"data":reqObj};
          insightsConfigurationServices.testInsight(req).then(function(response){
            if(response.data.status=="success"){
              //vm.ResponseOfTestInsightObj=JSON.stringify(response.data.data.insights[0].insight.result.actions);
              //var aaa={"data": {"context": {}, "insights": [{"status": "SENT", "request_id": "4ff3c050-d187-4062-b13b-ff90db17d46b", "sent_time": "2017-10-25T04:14:48.735064", "insight": {}, "entity_id": "66db655d-c6fa-4d97-b1dd-c3f75e4eb54f", "solution_id": "solution_02_658ee7d9-0796-43bb-b2a7-cdf6acc345ec", "insight_id": "9f3e6bba-fbd0-42ec-a9f7-00fcbad85617"}]}, "status": "success", "msg": "Get insight response"};
              if(response.data.data.insights[0].insight.result!=undefined){
                vm.ResponseOfTestInsightObj=response.data.data.insights[0].insight.result.actions;
              }
            }
            else{
              vm.ResponseOfTestInsightObj="";
            }

            vm.spinTestInsight=false;
          });
        }
      };

      vm.emptyCheck=function(val,key){
        if(val!="")
        angular.element(document.getElementById(key)).removeClass("notEmpty");
      };
  });
