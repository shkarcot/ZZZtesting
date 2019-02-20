(function() {
	'use strict';
	module.exports = [function() {
		var bodyContentController;

		bodyContentController = function($scope, $state, config ) {
			var vm = this;
            $scope.config = config;
            $scope.loginData = JSON.parse(localStorage.getItem('userInfo'));
             if($scope.loginData.user==undefined){
                $scope.loginData.user = {}
                $scope.loginData.user.solution_name = "";
                $scope.loginData.user.solution_id = "";
             }
            $scope.config.solution_name=$scope.loginData.user.solution_name;
		};

		bodyContentController.$inject = ['$scope', '$state', 'config'];

		return {
			restrict: 'E',
			controller: bodyContentController,
			controllerAs: 'fc',
			scope: {},
			bindToController: {
				menus: '='
			},
			template: require('./bodycontent.html')
		};

	}];
})();