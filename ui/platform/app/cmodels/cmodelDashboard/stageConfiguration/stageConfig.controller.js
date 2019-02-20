module.exports = ['$scope','entity','$rootScope','ngDialog','Upload','$state','$window','$location','$timeout','$http','$uibModalInstance', function($scope,entity,$rootScope,ngDialog,Upload,$state,$window,$location,$timeout,$http,$uibModalInstance) {
	'use strict';

    	var vm = this;
		vm.clear = clear;
		vm.feature = entity;
		vm.save = save;
		vm.getstageDeatilsByID =getstageDeatilsByID;
		vm.feedback = {};
		$scope.loaderfeedback = false;
		$scope.mySwitch = "false";

        console.log("vm.feature::id::"+JSON.stringify(vm.feature.view));
       if(vm.feature.view == "1")
       {
       $scope.mySwitch = "true";
       }
       else{
           $scope.mySwitch = "false";
       }

		// cancel button then close to form dialog popup.
		function clear()
		{
			$uibModalInstance.dismiss('cancel');
		}

		// click on save button then all data send to server.data is updated.
		function save()
		{
           vm.feature.reason = "";
           vm.feature.statusCd = "ACTIVE";
           $scope.stageJson = {
                                "classId": vm.feature.classId,
                                  "description": vm.feature.description,
                                  "reason": vm.feature.reason,
                                  "stageGrpNm": vm.feature.stageGrpNm,
                                  "stageInfo": vm.feature.stageInfo,
                                  "stageNm": vm.feature.stageNm,
                                  "statusCd": vm.feature.statusCd,
                                  "updatedAt": "2019-02-06 11:39:22",
                                  "updatedBy": "111111",
                                  "createdBy":"222222"

                             }
           if(vm.feature.id != "")
           {
             $scope.stageJson.id = vm.feature.id;
           }

			$http.post('http://localhost:18098/stage',$scope.stageJson, {
				headers : {
					'Content-Type' : 'application/json'
				}

			}).success(function(data) {

           // console.log("pipline: ::"+JSON.stringify(data));
                     $uibModalInstance.dismiss('cancel');
                     $.UIkit.notify({
                                   message : "Save Successfully",
                                   status  : 'success',
                                   timeout : 3000,
                                   pos     : 'top-center'
                                });

			}).error(function() {
				//AlertService.error('Server Error:Please contact to admin');

			});

		}
	   // success callback.
		function onSaveSuccess(result)
		{
			//$scope.$emit('pcswebApp:jobProcessUpdate', result);
			$uibModalInstance.close(result);
			//vm.isSaving = false;
		}

		// error callback.
		function onSaveError()
		{
			vm.isSaving = false;
		}
		function getstageDeatilsByID()
		{
		   $http.get('http://localhost:18098/stages/'+vm.feature.id , {
				headers : {
					'Content-Type' : 'application/json'
				}

			}).success(function(data) {
                   // console.log(""+JSON.stringify(data));
				  vm.feature = data;

			}).error(function() {
				$scope.showgraph = false;

			});

		}
		getstageDeatilsByID();



}];