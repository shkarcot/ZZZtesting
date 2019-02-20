module.exports = ['$scope', '$state', '$rootScope', '$sce', '$location','config','getUrl', function($scope, $state, $rootScope, $sce, $location, config, getUrl) {
	'use strict';
      var vm = this;
      $scope.config = config;
      $rootScope.$broadcast('breadcrumbObj',$state.current.breadcrumb);
      var url = $location.path();
      var arr = url.split("/");
      $rootScope.currentState = arr[arr.length-1];
      $scope.iframeHeight = window.innerHeight-45;
      $scope.elkUrl = $sce.trustAsResourceUrl(getUrl.data.elk_link);
}];