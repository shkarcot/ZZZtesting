module.exports = ['$scope','$state', '$rootScope','$stateParams','solutionObj','entitiesService','bpmnServices','domainDashboardService','caseManagementServices',
function($scope, $state, $rootScope,$stateParams,solutionObj,entitiesService,bpmnServices,domainDashboardService,caseManagementServices) {
	'use strict';
	var vm = this;
	vm.allBpmnFiles=[];
	$scope.showBpmnSpin=false;

	$rootScope.currentState = 'domainDashboard';
	$scope.loginData = JSON.parse(localStorage.getItem('userInfo'));

	entitiesService.getEntities({'sess_id':vm.sess_id}).then(function(data){

         $scope.domainObjects =  data.data.domain_object;
         $scope.domainObjectsCount = $scope.domainObjects.length;

     });

     vm.getAllBpmns = function(){
        var reqObj={"solution_id":solutionObj.solutionId};
        $scope.showBpmnSpin=true;
        vm.allBpmnFiles=[];
        bpmnServices.getListOfBpmnFiles(reqObj).then(function(response){
            if(response.data.status=="success"){
                $scope.showBpmnSpin=true;
                var respObj=response.data.data;
                angular.forEach(respObj,function(val,key){
                    vm.allBpmnFiles.push(val);
                });
                $scope.showBpmnSpin=false;
            }
            $scope.showBpmnSpin=false;

        },function(err){
            console.log("error----"+err.error);
            $scope.showBpmnSpin=false;
        });
    }

     //vm.getAllBpmns();


     vm.showBpmn = function(obj){
        bpmnServices.setSelectedBpmn(obj);
        $state.go('app.bpmn', {selctdBpmnObj:obj});
     };

     vm.setBpmnStatus =function(obj, state){
        console.log(state);
        console.log(obj);
        if(state==true){
            var reqObj={"solutionId":solutionObj.solutionId,"bpmnId":obj.bpmnId};
            bpmnServices.activateBpmn(reqObj, solutionObj.caseManagementApiUrl).then(function(response){
                if(response.data.status=="success"){
                    $.UIkit.notify({
                       message : response.data.message,
                       status  : 'success',
                       timeout : 3000,
                       pos     : 'top-center'
                    });
                }
                vm.getAllBpmns();
            },function(err){
                console.log("error----"+err.error);
                vm.getAllBpmns();
            });
        }
        else{
            vm.getAllBpmns();
        }
     };

     $scope.bpmnIconPath=function(){
        var url="/app/images/bpmn-icon-"+getRandomInt()+".png";
        console.log(url);
        return url;
     };
     function getRandomInt() {
        return Math.floor(Math.random() * Math.floor(4))+1;
     };

     vm.getAllDashboardVals = function(){
        domainDashboardService.getDashboardCount({"sess_id":$scope.loginData.sess_id}).then(function(response){
            if(response.data.status=="success"){
                $scope.dashboardCounts = response.data.data;
            }
        },function(err){

        });
     }

     vm.getAllDashboardVals();
     $scope.total_workflows="";
     vm.getAllWorkFlows = function(){
        var req = {"filter_obj":{"page_no":1,"no_of_recs":8,"sort_by":"updated_ts","order_by":false}};
        caseManagementServices.getAllWorkFlows({'sess_id':$scope.sess_id,'data':req}).then(function(response){
           if(response.data.status=="success"){
             $scope.total_workflows=response.data.total_workflows;
           }
        },function(err){

        });
     };
     vm.getAllWorkFlows();

}];