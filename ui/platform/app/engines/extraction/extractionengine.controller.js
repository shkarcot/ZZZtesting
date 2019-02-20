/*module.exports = ['$scope', '$state', '$rootScope',
                function($scope, $state, $rootScope) {
	'use strict';

}];*/

(function() {
	'use strict';

	module.exports = ['$state','$scope','$rootScope',
	function($state,$scope,$rootScope) {
		var vm = this;
        $rootScope.$broadcast('breadcrumbObj',$state.current.breadcrumb);
        $scope.loginData = JSON.parse(localStorage.getItem('userInfo'));
        vm.sess_id= $scope.loginData.sess_id;
    }];

})();