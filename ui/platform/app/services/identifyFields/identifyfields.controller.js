(function() {
	'use strict';

	module.exports = ['$state','$rootScope','$scope','identifyFieldsServices',
	function($state,$rootScope,$scope,identifyFieldsServices) {
		var vm = this;
        $rootScope.$broadcast('breadcrumbObj',$state.current.breadcrumb);
        $scope.loginData = JSON.parse(localStorage.getItem('userInfo'));
        vm.sess_id= $scope.loginData.sess_id;
        $rootScope.currentState = 'services';



    }];

})();