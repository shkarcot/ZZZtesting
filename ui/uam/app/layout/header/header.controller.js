(function() {
	'use strict';
	module.exports = [function() {
		var headerController;

		headerController = function($scope, $state) {
			var vm = this;
            $scope.logout =function(){

                localStorage.clear();
                window.location.href = "http://"+ location.host+"/logout";
            };
            $scope.createSolution =function(){
                $state.go('app.createSolution');
            }

		};

		headerController.$inject = ['$scope', '$state'];

		return {
			restrict: 'E',
			controller: headerController,
			controllerAs: 'fc',
			scope: {},
			bindToController: {
				menus: '='
			},
			template: require('./header.html')
		};

	}];
})();