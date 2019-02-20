module.exports = ['$scope','entity','$rootScope','ngDialog','Upload','$state','$window','$location','$timeout','$http','$uibModalInstance', function($scope,entity,$rootScope,ngDialog,Upload,$state,$window,$location,$timeout,$http,$uibModalInstance) {
	'use strict';

    	var vm = this;
		vm.clear = clear;
		vm.xstageconfig = entity;
		vm.save = save;
		vm.feedback = {};
		$scope.loaderfeedback = false;
		$scope.mySwitch = "false";
		$scope.statusdisable = "false";

        if(vm.xstageconfig.id == "")
	{
	  vm.xstageconfig.statusCd = "FINAL";
	  $scope.statusdisable = "true";
	  PipelineNameList();

	}else{
	  //vm.pipline.statusCd = "DRAFT";
	  $scope.statusdisable = "true";
	   PipelineNameList();

	}

		// cancel button then close to form dialog popup.
		function clear()
		{
			$uibModalInstance.dismiss('cancel');
		}

		// click on save button then all data send to server.data is updated.
		function save()
		{
           vm.xstageconfig.createdAt = "01-26-2019 12:01:28";
           vm.xstageconfig.createdBy = "99999";
           vm.xstageconfig.updatedAt =  "01-26-2019 12:01:28";
           vm.xstageconfig.updatedBy = "888888";

           for(var i=0;i<$scope.pipelinelist.length;i++)
           {
            if($scope.pipeNm == $scope.pipelinelist[i].pipeNm)
            {
             vm.xstageconfig.pipeInfo = JSON.stringify({'id':$scope.pipelinelist[i].id,'pipeNm':$scope.pipelinelist[i].pipeNm,'stageInfo':JSON.parse($scope.pipelinelist[i].stageInfo)});
            }
           }
            $scope.pipejobsconfig =   {
              "description":vm.xstageconfig.description,
              "endAt": vm.xstageconfig.endAt,
              "errorCd": vm.xstageconfig.errorCd,
              "errorDesc": vm.xstageconfig.errorDesc,
              "pipeInfo":vm.xstageconfig.pipeInfo,
              "pipejobNm":vm.xstageconfig.pipejobNm,
              "reason": vm.xstageconfig.reason,
              "startAt":vm.xstageconfig.startAt,
              "statusCd": vm.xstageconfig.statusCd,
              "submitAt": vm.xstageconfig.submitAt,
              "updatedAt":  vm.xstageconfig.updatedAt,
              "updatedBy": vm.xstageconfig.updatedBy,
                 "createdAt": vm.xstageconfig.createdAt,
               "createdBy": vm.xstageconfig.createdBy
            }
    if( vm.xstageconfig.id != "")
    {
          $scope.pipejobsconfig.id = vm.xstageconfig.id
    }


		  $http.post('http://localhost:18098/pipejob',$scope.pipejobsconfig, {
				headers : {
					'Content-Type' : 'application/json'
				}

			}).success(function(data) {

              $uibModalInstance.dismiss('cancel');
			  vm.xstageconfig = data;
			   $.UIkit.notify({
               message : "Save Successfully",
               status  : 'success',
               timeout : 3000,
               pos     : 'top-center'
            });

			}).error(function() {
                    $.UIkit.notify({
               message : "Internet Problem",
               status  : 'danger',
               timeout : 3000,
               pos     : 'top-center'
            });

			});

		}
	   // success callback.



        function piplineJobByID()
        {
           $http.get('http://localhost:18098/pipejobs/'+vm.xstageconfig.id, {
				headers : {
					'Content-Type' : 'application/json'
				}

			}).success(function(data) {

			  vm.xstageconfig = data;
			  var pipeName= JSON.parse(data.pipeInfo);
			  $scope.pipeNm = pipeName.pipeNm;

			}).error(function() {


			});
        }
        piplineJobByID();
   function PipelineNameList()
        {
        $scope.pipelinelist = [];
           $http.get('http://localhost:18098/pipes', {
				headers : {
					'Content-Type' : 'application/json'
				}

			}).success(function(data) {

			 for(var i=0;i<data.length;i++)
                {
                 //console.log("dd"+JSON.stringify(data[i]));
                 $scope.pipelinelist.push(data[i]);
                }

			}).error(function() {


			});
        }




}];