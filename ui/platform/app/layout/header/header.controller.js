(function() {
	'use strict';
	module.exports = [function() {
		var headerController;

		headerController = function($scope, $state,$window) {
			var vm = this;
			$scope.loginData = JSON.parse(localStorage.getItem('userInfo'));
			$scope.solution_name = localStorage.getItem('solutionName');
            $scope.logout =function(){

                localStorage.clear();
                window.location.href = "http://"+ location.host+"/logout";
            };
		};

		headerController.$inject = ['$scope', '$state','$window'];

		return {
			restrict: 'E',
			controller: headerController,
			controllerAs: 'hc',
			scope: {},
			bindToController: {
				menus: '='
			},
			template: require('./header.html')
		};

	}];
})();