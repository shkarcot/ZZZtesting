(function() {
	'use strict';

	module.exports = ['$state','$rootScope','$scope','ConvertDocumentServices','ngDialog',
	function($state,$rootScope,$scope,ConvertDocumentServices,ngDialog) {
		var vm = this;
        $rootScope.$broadcast('breadcrumbObj',$state.current.breadcrumb);
        $scope.loginData = JSON.parse(localStorage.getItem('userInfo'));
        $rootScope.currentState = 'services';
        vm.sess_id= $scope.loginData.sess_id;
       if($scope.loginData.user==undefined){
                $scope.loginData.user = {}
                $scope.loginData.user.solution_name = "";
                $scope.loginData.user.solution_id = "";
       }
        $scope.solution_id=$scope.loginData.user.solution_id;
        $scope.servicesObj = JSON.parse(localStorage.getItem('servicesObj'));
        if($scope.solution_id!=undefined){
            if(localStorage.getItem($scope.solution_id)!="")
                $scope.ingestedDoc_id = JSON.parse(localStorage.getItem($scope.solution_id));
            else
            $scope.ingestedDoc_id ="";
        }
        else{
            $scope.ingestedDoc_id = "";
        }
        $scope.inputDocumentId = $scope.ingestedDoc_id;
        $scope.resposeData={};
        $scope.showTable=false;
        $scope.data={
                 "document_conversions":[{
                    "from":"pdf",
                    "to":"png",
                    "preprocess":[
                        {"type":"greyscale"},
                        {"type":"skewness"},
                        {"type":"thresholding"},
                        {"type":"resize","scale":"0.5"}
                    ],
                    "enabled":false
                    }]
                 };

        $scope.setConfig= function(id){
            var obj={};
            obj[$scope.servicesObj.request_trigger]=$scope.servicesObj;
            obj[$scope.servicesObj.request_trigger].service_configuration=$scope.data.document_conversions[id];
                ConvertDocumentServices.configureConvertDoc({'data':obj,'sess_id':vm.sess_id}).then(function(data){
                   if(data.data.status=="success"){
                      $.UIkit.notify({
                         message :data.data.msg,
                         status  : 'success',
                         timeout : 2000,
                         pos     : 'top-center'
                      });
                   }
                   else{
                        $.UIkit.notify({
                           message : data.data.msg,
                           status  : 'warning',
                           timeout : 2000,
                           pos     : 'top-center'
                        });

                   }
                },function(err){
                  $.UIkit.notify({
                         message : 'Internal Server Error',
                         status  : 'danger',
                         timeout : 2000,
                         pos     : 'top-center'
                  });
                });
        };

        $scope.testDocId=function(val){
            if(val!=""){
                $scope.resposeData={};
                $scope.showTable=false;
                var obj={"request_type":$scope.servicesObj.request_trigger,"doc_id": val};
                 ConvertDocumentServices.testConvertDoc({'data':obj,'sess_id':vm.sess_id}).then(function(data){
                   if(data.data.status=="success"){
                        if(data.data.data.insights.length>0){
                            if(data.data.data.insights[0].insight.document.doc_id!=undefined){
                                $scope.showTable=true;
                                $scope.resposeData=data.data.data.insights[0].insight.document;
                            }
                        }
                        else
                        {
                            $scope.showTable=false;
                        }
                   }
                   else{
                        $.UIkit.notify({
                           message : data.data.msg,
                           status  : 'warning',
                           timeout : 2000,
                           pos     : 'top-center'
                        });
                        $scope.showTable=false;

                   }
                },function(err){
                  $.UIkit.notify({
                         message : 'Internal Server Error',
                         status  : 'danger',
                         timeout : 2000,
                         pos     : 'top-center'
                  });
                  $scope.showTable=false;
                });
            }
            else{
                $.UIkit.notify({
                   message : "Please enter Document Id.",
                   status  : 'warning',
                   timeout : 2000,
                   pos     : 'top-center'
                });
                $scope.showTable=false;
            }
        };

    }];
})();