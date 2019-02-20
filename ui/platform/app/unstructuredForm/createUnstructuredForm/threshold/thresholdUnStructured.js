'use strict';
angular.module('console.createUnStructuredForm')
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
  .controller('thresholdUnStructuredCtrl', function (
                              $scope,$state,$rootScope,$location,
                              Upload,$stateParams,ngDialog,
                              documentService,$window,$timeout) {
      var vm = this;
      vm.loginData = JSON.parse(localStorage.getItem('userInfo'));
      vm.sess_id= vm.loginData.sess_id;
      $(".threshold-custom").height($(window).height());
      vm.thresholdsData={};
      $scope.onBlurVal="";
      $scope.onFocusVal="";
      vm.showCTH=true;
      $rootScope.getDocumentsList = function(id){
        vm.thresholdsData={};
        $scope.onBlurVal="";
        $scope.onFocusVal="";
        documentService.getDocumentDetails(vm.sess_id,id).then(function(resp){
            console.log(resp);
            if(angular.equals(resp.data.status,'success')){
                vm.documentTemplate = resp.data.data;
                if(resp.data.data.thresholds!=undefined){
                    vm.thresholdsData=resp.data.data.thresholds;
                }
                if(vm.thresholdsData.custom!=undefined  && vm.thresholdsData.custom.length>0){
                     vm.showCTH=false;
                }
                else{
                     vm.showCTH=true;
                }
                console.log(vm.thresholdsData);

            }
            else{
                $.UIkit.notify({
                message : resp.data.msg,
                status  : 'danger',
                timeout : 2000,
                pos     : 'top-center'
                });
                return false;
            }
        },function(err){
            console.log(err)
            $.UIkit.notify({
            message : "Internal server error",
            status  : 'warning',
            timeout : 3000,
            pos     : 'top-center'
            });
            return false;
        });
      };

      vm.mappingEntities=[];

      vm.getAllMappingEntities = function(tempId,sessId){
            documentService.getMappingEntities(tempId,sessId).then(function (data) {
                if(data.data.status=="success"){
                    vm.mappingEntities=data.data.data;
                }
                else {
                    vm.mappingEntities=[];
                }
            },function (err) {
                $.UIkit.notify({
                 message : "Internal server error @getMappingEntities",
                 status  : 'warning',
                 timeout : 3000,
                 pos     : 'top-center'
                });
                vm.mappingEntities=[];
            });
        };

        vm.getAllMappingEntities($rootScope.state_id,vm.sess_id);


        $scope.setDisplayLabel=function(key){
            if(key!=""){
                var text = key.replace(/_/g, " ");

                var res = text.split(' ')
               .map(w => w[0].toUpperCase() + w.substr(1).toLowerCase())
               .join(' ')

                return res;
            }
            else{
                return "";
            }
        };
        $scope.slider = {
            value: 60,
            options: {
              floor: 0,
              ceil: 100,
              step: 1,
              minLimit: 0,
              maxLimit: 100,
              showSelectionBar: true,
              hidePointerLabels: true,
              hideLimitLabels: true,
              autoHideLimitLabels: true,
              getSelectionBarColor: function(value) {return '#8c8c8c8';},
              id: 'slider-id',
              onEnd: function(id, modelValue) {
                 $scope.onBlurVal=modelValue;
                 $scope.saveThresholds();
               },
              onStart: function(id, modelValue) {
                $scope.onFocusVal=modelValue;
              }
            }
        };

      $scope.refreshSlider = function () {
        setTimeout(function(){
            $scope.$broadcast('rzSliderForceRender');
        },500);
      };


      $scope.onBlurValue=function(val){
        $scope.onBlurVal=val;
        console.log("onBlurValue=>", $scope.onBlurVal);
        $scope.saveThresholds();
      };
      $scope.onFocusValue=function(val){
        $scope.onFocusVal=val;
        console.log("onFocusValue=>", $scope.onFocusVal);
      };

      $scope.saveThresholds=function(){
//           if($scope.onFocusVal!=$scope.onBlurVal){
                var obj={"sess_id":vm.sess_id, "data":{
                "data":{"template_id":$rootScope.state_id,"thresholds":vm.thresholdsData}}};
                documentService.saveThresholds(obj).then(function (data) {
                    if(data.data.status=="success"){
                        $.UIkit.notify({
                         message : data.data.msg,
                         status  : 'success',
                         timeout : 3000,
                         pos     : 'top-center'
                        });
                    }
                    else {
                        $.UIkit.notify({
                         message : data.data.msg,
                         status  : 'warning',
                         timeout : 3000,
                         pos     : 'top-center'
                        });
                    }
                    $rootScope.getDocumentsList($rootScope.state_id);
                },function (err) {
                    $.UIkit.notify({
                     message : "Internal server error @saveThresholds",
                     status  : 'warning',
                     timeout : 3000,
                     pos     : 'top-center'
                    });
                    $rootScope.getDocumentsList($rootScope.state_id);
                });
//           }
      };

    vm.processList=[{"name":"Annotation","value":"annotation"},
                    {"name":"Extraction","value":"extraction"},
                    {"name":"Post Processing","value":"post_processing"},
                    {"name":"Page Classification","value":"page_classification"}];

    vm.objOfNewThreshold={"process":"","attribute":"", "score":0};
    var editIndex=null;
    vm.create = function(){
        $scope.labelForcreate="Create Custom Threshold";
        document.getElementById("createThreshold").style.width = "40%";
         vm.objOfNewThreshold={"process":"","attribute":"", "score":0};
         editIndex=null;
    };
    vm.cancelCustomThreshold =function(){
         document.getElementById("createThreshold").style.width = "0%";
         vm.objOfNewThreshold={"process":"","attribute":"", "score":0};
         editIndex=null;
    };

    $scope.slider1 = {
            value: 60,
            options: {
              floor: 0,
              ceil: 100,
              step: 1,
              minLimit: 0,
              maxLimit: 100,
              showSelectionBar: true,
              hidePointerLabels: true,
              hideLimitLabels: true,
              autoHideLimitLabels: true,
              getSelectionBarColor: function(value) {return '#8c8c8c';},
              id: 'slider1-id',
              onEnd: function(id, modelValue) { console.log(vm.objOfNewThreshold);},
              onStart: function(id, modelValue) {  }
            }
        };
        vm.saveCustomThreshold =function(){
            if(vm.objOfNewThreshold.attribute==""){
                $.UIkit.notify({
                 message : "Please select the Threshold for",
                 status  : 'warning',
                 timeout : 3000,
                 pos     : 'top-center'
                });
            }else if(vm.objOfNewThreshold.process==""){
                $.UIkit.notify({
                 message : "Please select the process",
                 status  : 'warning',
                 timeout : 3000,
                 pos     : 'top-center'
                });
            }
            else{

                if(editIndex!=null){
                vm.thresholdsData.custom[editIndex]=vm.objOfNewThreshold;
                }
                else{
                    if(!vm.thresholdsData.hasOwnProperty('custom')){
                        vm.thresholdsData['custom']=[];
                    }
                    vm.thresholdsData.custom.push(vm.objOfNewThreshold);
                }
                var obj={"sess_id":vm.sess_id, "data":{"data":{"template_id":$rootScope.state_id,"thresholds":vm.thresholdsData}}};
                documentService.saveThresholds(obj).then(function (data){
                    if(data.data.status=="success"){
                        $.UIkit.notify({
                         message : data.data.msg,
                         status  : 'success',
                         timeout : 3000,
                         pos     : 'top-center'
                        });
                        vm.cancelCustomThreshold();
                    }
                    else {
                        $.UIkit.notify({
                         message : data.data.msg,
                         status  : 'warning',
                         timeout : 3000,
                         pos     : 'top-center'
                        });
                    }
                    $rootScope.getDocumentsList($rootScope.state_id);
                },function (err) {
                    $.UIkit.notify({
                     message : "Internal server error @saveCustomThreshold",
                     status  : 'warning',
                     timeout : 3000,
                     pos     : 'top-center'
                    });
                    $rootScope.getDocumentsList($rootScope.state_id);
                });
            }
        };

        vm.editCustomThreshold=function(cthObj,idx){
            editIndex=idx;
            vm.objOfNewThreshold.attribute=vm.thresholdsData.custom[idx].attribute;
            vm.objOfNewThreshold.process=vm.thresholdsData.custom[idx].process;
            vm.objOfNewThreshold.score=vm.thresholdsData.custom[idx].score;
            $scope.labelForcreate="Create Custom Threshold";
            document.getElementById("createThreshold").style.width = "40%";
            $scope.refreshSlider();
        };

        vm.deleteCustomThreshold=function(cthObj,idx){
            vm.thresholdsData.custom.splice(idx, 1);
            var obj={"sess_id":vm.sess_id, "data":{"data":{"template_id":$rootScope.state_id,"thresholds":vm.thresholdsData}}};
            documentService.saveThresholds(obj).then(function (data) {
                if(data.data.status=="success"){
                    $.UIkit.notify({
                     message : "Custom Threshold data deleted successfully",
                     status  : 'success',
                     timeout : 3000,
                     pos     : 'top-center'
                    });
                }
                else {
                    $.UIkit.notify({
                     message : data.data.msg,
                     status  : 'warning',
                     timeout : 3000,
                     pos     : 'top-center'
                    });
                }
                $rootScope.getDocumentsList($rootScope.state_id);
            },function (err) {
                $.UIkit.notify({
                 message : "Internal server error @deleteCustomThreshold",
                 status  : 'warning',
                 timeout : 3000,
                 pos     : 'top-center'
                });
                $rootScope.getDocumentsList($rootScope.state_id);
            });

        };

        vm.hoverText={"page_classification":{},"extraction":{},"annotation":{},"post_processing":{}};
        //Page Classification
        vm.hoverText.page_classification['document_threshold']="All documents with a lesser confidence score will not move to extraction without manual review";
        vm.hoverText.page_classification['entity_confidence_score']="All entities with a lesser confidence score will not require manual user review";

        //Extraction
        vm.hoverText.extraction['document_threshold']="All documents with a lesser confidence score will not move to post processing without manual review";
        vm.hoverText.extraction['entity_confidence_score']="All entities with a lesser confidence score will not require manual user review";

        //Annotation
        vm.hoverText.annotation['document_threshold']="All documents with a lesser confidence score will not move to post processing without manual review";
        vm.hoverText.annotation['entity_confidence_score']="All entities with a lesser confidence score will not require manual user review";

        //Post processing
        vm.hoverText.post_processing['document_threshold']="All documents with a lesser confidence score will not get processed without manual review";
        vm.hoverText.post_processing['entity_confidence_score']=" All entities with a lesser confidence score will not require manual user review";


      /******************************************************************************
                Thresholds code ends here
      ******************************************************************************/


  });
