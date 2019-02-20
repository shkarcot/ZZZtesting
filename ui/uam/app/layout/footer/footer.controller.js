(function() {
	'use strict';
	module.exports = [function() {
		var footerController;

		footerController = function($scope, $state) {
			var vm = this;

		};

		footerController.$inject = ['$scope', '$state'];

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