module.exports = ['$scope','$sce', '$state', '$rootScope', '$location',
function($scope,$sce, $state, $rootScope, $location) {
	'use strict';
      var vm = this;
      $rootScope.$broadcast('breadcrumbObj',$state.current.breadcrumb);
      var url = $location.path();

      var arr = url.split("/");
      $rootScope.currentState = arr[arr.length-1];
      $scope.iframeHeight = window.innerHeight-90;


      $rootScope.currentState = arr[arr.length-1];
      $scope.iframeHeight = window.innerHeight;
      $scope.isNifi = true;

}];