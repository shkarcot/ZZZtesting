module.exports = ['$scope','$sce', '$state', '$rootScope', '$location','pipelineServices','getUrl', function($scope,$sce, $state, $rootScope, $location, pipelineServices,getUrl) {
	'use strict';
      var vm = this;
      $rootScope.$broadcast('breadcrumbObj',$state.current.breadcrumb);
      var url = $location.path();

      var arr = url.split("/");
      $rootScope.currentState = arr[arr.length-1];
      $scope.iframeHeight = window.innerHeight-90;

     // $scope.nifiUrl = $sce.trustAsResourceUrl(getUrl.data.nifi_link);
      $scope.nifiUrl = $sce.trustAsResourceUrl("http://35.172.23.71:17999/nifi");
      $rootScope.currentState = arr[arr.length-1];
      $scope.iframeHeight = window.innerHeight;
      $scope.isNifi = true;

      $scope.getNifiUrl = function(){
        pipelineServices.getUrls({'sess_id':vm.sess_id}).then(function(data){
                 // $scope.nifiUrl = $sce.trustAsResourceUrl(data.data.nifi_link);
                 $scope.nifiUrl = $sce.trustAsResourceUrl("http://35.172.23.71:17999/nifi");



        },function(err){
         console.log(err);
         $.UIkit.notify({
                 message : "Internal server error",
                 status  : 'warning',
                 timeout : 3000,
                 pos     : 'top-center'
         });
        });
      };

      $scope.getNifi = function(){
        pipelineServices.getNifiStatus({'sess_id':vm.sess_id}).then(function(data){
                  // $scope.isNifi=data.data.is_nifi;
                   if($scope.isNifi)
                     $scope.getNifiUrl();




        },function(err){
         console.log(err);
         $.UIkit.notify({
                 message : "Internal server error",
                 status  : 'warning',
                 timeout : 3000,
                 pos     : 'top-center'
         });
        });
      };




      $scope.getNifi();
      $scope.reloadNifi = function(){
        $scope.getNifi();
      };

      $scope.$on("$destroy",function(){
        if (angular.isDefined($scope.timer)) {
            clearInterval($scope.timer);
        }
      });



      $scope.timer = setInterval(function(){ $scope.getNifi(); }, 30000);

}];