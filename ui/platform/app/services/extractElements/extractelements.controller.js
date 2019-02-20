(function() {
	'use strict';

	module.exports = ['$state','$rootScope','$scope','ExtractElementsServices','ngDialog',
	function($state,$rootScope,$scope,ExtractElementsServices,ngDialog) {
	    var vm = this;
        $rootScope.$broadcast('breadcrumbObj',$state.current.breadcrumb);
        $scope.loginData = JSON.parse(localStorage.getItem('userInfo'));
        vm.sess_id= $scope.loginData.sess_id;
        $rootScope.currentState = 'services';
        $scope.configMessage="Default configuration setting have been applied.";
        vm.sess_id= $scope.loginData.sess_id;
         if($scope.loginData.user==undefined){
                $scope.loginData.user = {}
                $scope.loginData.user.solution_name = "";
                $scope.loginData.user.solution_id = "";
         }
        $scope.solution_id=$scope.loginData.user.solution_id;
        if($scope.solution_id!=undefined){
            if(localStorage.getItem($scope.solution_id)!="")
                $scope.ingestedDoc_id = JSON.parse(localStorage.getItem($scope.solution_id));
            else
            $scope.ingestedDoc_id ="";

        }
        else{
            $scope.ingestedDoc_id = "";
        }
        $scope.servicesObj = JSON.parse(localStorage.getItem('servicesObj'));

        $scope.inputDocumentId = $scope.ingestedDoc_id;
        $scope.resposeData={};
        $scope.showTable=false;

        $scope.testDocId=function(val){
            if(val!=""){
                $scope.resposeData={};
                $scope.showTable=false;
                var obj={"request_type":$scope.servicesObj.request_trigger,"doc_id": val};
                 ExtractElementsServices.testExtractElements({'data':obj,'sess_id':vm.sess_id}).then(function(data){
                   if(data.data.status=="success"){
                        $scope.showTable=true;
                        $scope.resposeData=data.data;
                        /*if(data.data.data.insights.length>0){
                            $scope.showTable=true;
                            $scope.resposeData=data.data.data.insights[0].insight.documents;
                        }
                        else
                        {
                            $scope.showTable=false;
                        }*/
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

        $scope.showCoords=function(coordinates){
            var cords=JSON.stringify(coordinates);
            cords=cords.replace("{", " ");
            cords=cords.replace("}", " ");
            cords=cords.replace('"y1"', "y1 ");
            cords=cords.replace('"y2"', "y2 ");
            cords=cords.replace('"x1"', "x1 ");
            cords=cords.replace('"x2"', "x2 ");
            cords = cords.split(',').join(', ');
            cords = cords.split(':').join(': ');
            return cords;
        };
    }];
})();