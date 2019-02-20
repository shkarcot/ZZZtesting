(function() {
	'use strict';
	module.exports = [function() {
		var bodyContentController;

		bodyContentController = function($scope, $state) {
			var vm = this;

		};

		bodyContentController.$inject = ['$scope', '$state'];

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