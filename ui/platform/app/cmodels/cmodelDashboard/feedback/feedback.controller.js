module.exports = ['$scope','entity','$rootScope','ngDialog','Upload','$state','$window','$location','$timeout','$http','$uibModalInstance', function($scope,entity,$rootScope,ngDialog,Upload,$state,$window,$location,$timeout,$http,$uibModalInstance) {
	'use strict';

    	var vm = this;
		vm.feedbackProcess = entity;
		vm.clear = clear;
		vm.save = save;
		vm.feedback = {};
		$scope.loaderfeedback = false;


        function getfeedbackbyid()
        {

        	$scope.loaderfeedback = true;
        	 $http.get('http://ec2-52-55-236-26.compute-1.amazonaws.com:18098/sentiment', {
				headers : {
					'Content-Type' : 'application/json',
				}

			}).success(function(data) {
                  $scope.data = data;
				for(var i=0;i<$scope.data.length;i++)
				{
				   if(vm.feedbackProcess.id == $scope.data[i].id)
	        		{
					$scope.loaderfeedback = false;
	        		vm.feedback.id = $scope.data[i].id;
                    vm.feedback.brand = $scope.data[i].brand;
	        		vm.feedback.category = $scope.data[i].category;
	        		vm.feedback.model =  $scope.data[i].model;
	        		vm.feedback.product =  $scope.data[i].product;
	        		vm.feedback.createdAt = $scope.data[i].createdAt;
	        		vm.feedback.extId = $scope.data[i].extId;
	        		vm.feedback.source = $scope.data[i].source;
	        		vm.feedback.text = $scope.data[i].text;
	        		vm.feedback.sentiment = $scope.data[i].sentiment;
	        		vm.feedback.model = $scope.data[i].model;
	        		vm.feedback.fbSentiment = $scope.data[i].fbSentiment;
	        		}
				}

			}).error(function() {
				$scope.showgraph = false;

			});


        }
        getfeedbackbyid();
		// cancel button then close to form dialog popup.
		function clear() {
			$uibModalInstance.dismiss('cancel');
		}

		// click on save button then all data send to server.data is updated.
		function save()
		{
			vm.isSaving = true;
			$uibModalInstance.dismiss('cancel');
			console.log("feedbackProcess:"+JSON.stringify(vm.feedback.fbSentiment));

			//getfdData.update(vm.feedback, onSaveSuccess, onSaveError);
			$http.post('http://ec2-52-55-236-26.compute-1.amazonaws.com:18098/sentiment',vm.feedback ,{
				headers : {
					'Content-Type' : 'application/json'
				}

			}).success(function(data) {

                    $.UIkit.notify({
                         message : 'Feedback Sentiment Save Successfully',
                         status  : 'success',
                         timeout : 2000,
                         pos     : 'top-center'
                     });

			}).error(function() {
				$scope.showgraph = false;

			});

		}

	   // success callback.
		function onSaveSuccess(result) {
			//$scope.$emit('pcswebApp:jobProcessUpdate', result);
			$uibModalInstance.close(result);
			//vm.isSaving = false;
		}

		// error callback.
		function onSaveError() {
			vm.isSaving = false;
		}



}];