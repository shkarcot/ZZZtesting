module.exports = ['$http','$scope','entity','$uibModalInstance','createPiplineService1',function($http,$scope,entity,$uibModalInstance,createPiplineService1) {
	'use strict';

    var vm = this;
    vm.pipline = entity;
    vm.clear = clear;
	vm.save = save;
	$scope.mySwitch = "false";
	if(vm.pipline.id == "")
	{
	  vm.pipline.statusCd = "DRAFT";
	  $scope.mySwitch = "true";

	}else{
	  //vm.pipline.statusCd = "DRAFT";
	  $scope.mySwitch = "false";

	}
	function clear()
	{
	  $uibModalInstance.dismiss('cancel');
	}

	// click on save button then all data send to server.data is updated.
	function save()
	{
	  vm.isSaving = true;
	  vm.pipline.createdAt = "";
	  vm.pipline.createdBy = "";
	  vm.pipline.updatedAt= "";
	  vm.pipline.updatedBy = "";
	  if(vm.pipline.id == "")
	  {

	   $scope.jsondata =  {"pipeNm":vm.pipline.pipeNm,"type":vm.pipline.type,"description":vm.pipline.description,"stageInfo":vm.pipline.stageInfo,
	      "stagePrevInfo":vm.pipline.stagePrevInfo,"reason":vm.pipline.reason,"statusCd":vm.pipline.statusCd,"createdAt":vm.pipline.createdAt,
	      "createdBy":vm.pipline.createdBy,"updatedAt":vm.pipline.updatedAt,"updatedBy":vm.pipline.updatedBy
	     }
	  }
	  else
	  {
       $scope.jsondata =  {"id":vm.pipline.id,"pipeNm":vm.pipline.pipeNm,"type":vm.pipline.type,"description":vm.pipline.description,"stageInfo":vm.pipline.stageInfo,
	      "stagePrevInfo":vm.pipline.stagePrevInfo,"reason":vm.pipline.reason,"statusCd":vm.pipline.statusCd,"createdAt":vm.pipline.createdAt,
	      "createdBy":vm.pipline.createdBy,"updatedAt":vm.pipline.updatedAt,"updatedBy":vm.pipline.updatedBy
	     }
	  }
	 // console.log(""+JSON.stringify(vm.pipline));
	 $http.post('http://localhost:18098/pipe',$scope.jsondata,{
				headers : {
					'Content-Type' : 'application/json'
				}

			}).success(function(data) {
              $uibModalInstance.dismiss('cancel');
           // console.log("pipline: ::"+JSON.stringify(data));

                vm.pipline =  data;
                 $.UIkit.notify({
               message : "Save Successfully",
               status  : 'success',
               timeout : 3000,
               pos     : 'top-center'
            });



			}).error(function() {
				//AlertService.error('Server Error:Please contact to admin');

			});
	  //$uibModalInstance.dismiss('cancel');
	}
	$scope.piplineType = function()
	{
	    $scope.piplineype = [];
	    // console.log("eventdd::"+$scope.piplineId.id);
	     var data = '1';
			$http.get('http://localhost:18098/sysvalue/pipe_type', {
				headers : {
					'Content-Type' : 'application/json'
				}

			}).success(function(data) {

           // console.log("pipline: ::"+JSON.stringify(data));
             for(var i=0;i<data.length;i++)
             {
                $scope.piplineype.push(data[i]);
             }



			}).error(function() {
				//AlertService.error('Server Error:Please contact to admin');

			});
			// console.log("event::"+$event+""+statesearch);
			//$scope.piplineype.push(data[i]);
			//http://localhost:18098/sysvalue/pipe_type


    }
	  $scope.piplineType();
	  $scope.pipline_Edit = function()
	{
			$http.get('http://localhost:18098/pipes/'+vm.pipline.id, {
				headers : {
					'Content-Type' : 'application/json'
				}

			}).success(function(data) {

              vm.pipline = data;


			}).error(function() {
				//AlertService.error('Server Error:Please contact to admin');

			});

    }
    if(vm.pipline.id != null)
    {
      $scope.pipline_Edit();
    }




}];