/*module.exports = ['$scope', '$state', '$rootScope',
                function($scope, $state, $rootScope) {
	'use strict';

}];*/

(function() {
	'use strict';

	module.exports = ['$state','$rootScope','$scope',
	function($state,$rootScope,$scope) {
		var vm = this;
        $rootScope.$broadcast('breadcrumbObj',$state.current.breadcrumb);
        $scope.loginData = JSON.parse(localStorage.getItem('userInfo'));
        vm.sess_id= $scope.loginData.sess_id;


    }];

})();