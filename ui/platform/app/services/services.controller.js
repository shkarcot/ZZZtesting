module.exports = ['$scope', '$state', '$rootScope', 'docServices','config','ngDialog',
function($scope, $state, $rootScope, docServices,config,ngDialog) {
    'use strict';
    $rootScope.$broadcast('breadcrumbObj',$state.current.breadcrumb);
    $rootScope.currentState = 'services';
    $scope.config = config;
    $scope.loginData = JSON.parse(localStorage.getItem('userInfo'));
    $scope.sess_id= $scope.loginData.sess_id;
    $scope.serviceStatus=[];
    $scope.isEnable=[];
    $scope.showSpinner=[];
    $scope.serviceObj = {};
    $scope.serviceObj.method = 'get';

    $scope.serviceDescription={
       "classify_document":"description of classify document description of classify document description of classify document",
       "Extract Entities":"description of Extract Entities",
       "extract_document_text":"description of extract document text",
       "document_details":"description of document details",
       "Extract Intent":"description of Extract Intent",
       "convert_document":"description of convert document",
       "ingest_document":"description of ingest document",
       "document_info":"description of document info",
       "extract_document_metadata":"description of extract document metadata",
       "extract_document_elements":"description of extract document elements",
       "extract_document_entities":"description of extract document entities",
       "download_document":"description of download document",
       "extract_intent":"description of extract intent",
       "extract_document_page_groups":"description of extract document page group"
       };


    $scope.getServices=function(){
        docServices.getServices({'sess_id':$scope.sess_id,'data':''}).then(function(response){
           if(response.data.status=="success"){
             $scope.engineData=response.data.data.services;
             console.log($scope.engineData);

             angular.forEach($scope.engineData, function(value, key) {
              if(value.is_enabled == true){
                $scope.serviceStatus[key]='enable';
                $scope.isEnable[key]=value.is_enabled;
              }
              else{
                $scope.serviceStatus[key]='disable';
                $scope.isEnable[key]=value.is_enabled;
              }
              $scope.showSpinner[key]=false;
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
        });
    };
    $scope.getServices();

    $scope.getStatus=function(val){
        if(val=='enable')
            return true;
        else
            return false;
    };

    $scope.checkForType = function(param){
        if(param != undefined && param!='' && param!=null){
            try{
                JSON.parse(param);
            }
            catch(e){
                return false;
            }
        }
        else{
            return false;
        }
        return true;
    };

    $scope.createNewService = function(){
        var req_flag = false;
        var res_flag = false;
        var header_flag = false;
        if($scope.checkForType($scope.serviceObj.request_schema))
            req_flag = true;
        else{
            if($scope.serviceObj.request_schema!=undefined && $scope.serviceObj.request_schema!='' && $scope.serviceObj.request_schema!=null){
                $scope.serviceObj.request_schema;
                $.UIkit.notify({
                   message : 'Request format must be JSON',
                   status  : 'danger',
                   timeout : 3000,
                   pos     : 'top-center'
               });

               return;
            }
        }

        if($scope.checkForType($scope.serviceObj.response_schema))
            res_flag = true;
        else{
            if($scope.serviceObj.response_schema!=undefined && $scope.serviceObj.response_schema!='' && $scope.serviceObj.response_schema!=null){
                delete $scope.serviceObj.response_schema
                $.UIkit.notify({
                   message : 'Response format must be JSON',
                   status  : 'danger',
                   timeout : 3000,
                   pos     : 'top-center'
               });

               return;
            }
        }

        if($scope.checkForType($scope.serviceObj.headers))
            header_flag = true;
        else{
            if($scope.serviceObj.headers!=undefined && $scope.serviceObj.headers!='' && $scope.serviceObj.headers!=null){
                delete $scope.serviceObj.headers
                $.UIkit.notify({
                   message : 'Headers format must be JSON',
                   status  : 'danger',
                   timeout : 3000,
                   pos     : 'top-center'
               });

               return;
            }
        }

        if(header_flag){
            $scope.serviceObj.headers = JSON.parse($scope.serviceObj.headers);
        }

        if(res_flag){
            $scope.serviceObj.response_schema = JSON.parse($scope.serviceObj.response_schema);
        }

        if(req_flag){
            $scope.serviceObj.request_schema = JSON.parse($scope.serviceObj.request_schema);
        }

        console.log($scope.serviceObj)
        docServices.createService({'sess_id':$scope.sess_id,'data': $scope.serviceObj}).then(function(response){
           if(response.data.status=="success"){
               $scope.getServices();
               $scope.serviceObj ={};
               $scope.closeServices();
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
                   status  : 'danger',
                   timeout : 3000,
                   pos     : 'top-center'
               });
           }
        },function(err){
               $.UIkit.notify({
                   message : 'Internal Server Error',
                   status  : 'warning',
                   timeout : 3000,
                   pos     : 'top-center'
               });
        });
    };

    $scope.cancelNewService = function(){
       $scope.serviceObj ={};
       $scope.closeServices();
    };

    $scope.gotoEngine=function(state,engine,key,obj){
        localStorage.setItem('servicesObj',JSON.stringify($scope.engineData[key]));
        $state.go('app.services.configServices',{serviceObj:obj});
    };

      $scope.setServiceStatus=function(key,value){
        var reqObj={"configuration": {
            "service_name": key,
            "is_enabled": false,
            "is_enrichment_enabled": false
        }};
        var msg="";
        if(value.is_enabled==false){
            reqObj.configuration.is_enabled=true;
            msg=" service has been enabled.";
        }
        else{
            reqObj.configuration.is_enabled=false;
            msg=" service has been disabled.";
        }
        console.log(reqObj);
        $scope.showSpinner[key]=true;
        docServices.postServices({'sess_id':$scope.sess_id,'data':reqObj}).then(function(response){
            $scope.showSpinner[key]=false;
           if(response.data.status=="success"){
               $.UIkit.notify({
                   message : value.display_name + msg,
                   status  : 'success',
                   timeout : 3000,
                   pos     : 'top-center'
               });
           }
           else if(response.data.status=="failure"){
                $.UIkit.notify({
                   message : response.data.msg,
                   status  : 'warning',
                   timeout : 3000,
                   pos     : 'top-center'
               });
           }
           else{
                $.UIkit.notify({
                   message : response.data.msg,
                   status  : 'danger',
                   timeout : 3000,
                   pos     : 'top-center'
               });
           }
           $scope.getServices();
        });
      };
      $scope.createServices = function(){
        document.getElementById("createSerive").style.width = "40%";
      };
      $scope.closeServices = function(){
        document.getElementById("createSerive").style.width = "0%";
      };

      function removeSpace(string) {
        if (!angular.isString(string)) {
            return string;
        }
        return string.replace(/[\s]/g, '');
      }
      $("#searchbar .search-label").on("click", function(e){
        e.preventDefault();
        $("#searchbar").toggleClass("collapsed");
      });
      $scope.cancelSearch = function(){
        $scope.searchValue='';
      }

}];