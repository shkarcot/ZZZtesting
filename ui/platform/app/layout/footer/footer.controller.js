(function() {
	'use strict';
	module.exports = [function() {
		var footerController;

		footerController = function($scope, $state, config) {
			var vm = this;
            $scope.config = config;
		};

		footerController.$inject = ['$scope', '$state', 'config'];

		return {
			restrict: 'E',
			controller: footerController,
			controllerAs: 'fc',
			scope: {},
			bindToController: {
				menus: '='
			},
			template: require('./footer.html')
		};

	}];
})();