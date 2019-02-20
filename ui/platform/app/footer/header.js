(function() {
	'use strict';
	module.exports = [function() {
		var headerController;

		headerController = function($scope, $state, applicationService) {
			var vm = this;

			//Extracts only menu related infos from all modules config
			vm.extractMenuOptions = function(stateData) {
				var menuOptions = [];
				if (stateData && angular.isArray(stateData)) {
					var parentMenu = [];
					angular.forEach(stateData, function(index) {
						if (angular.isUndefined(index.abstract)) {
							var temp = {};
							if (index.parent) {
								var parent = index.parent.split('.')[1];
								//check if already present else add it.
								if (parentMenu.indexOf(parent) <= -1) {
									parentMenu.push(parent);
									temp.state = parent;
									temp.url = index.url;
									if (index.data && index.data.menuConfig) {
										for (var key in index.data.menuConfig) {
											temp[key] = index.data.menuConfig[key];
										}
									}
									menuOptions.push(temp);
								} else {

								}

							}

						}

					});
				}
				return menuOptions;
			};

			//Gets all state infos defined across modules config methods
			var stateData = applicationService.getStateList();

			vm.menus = vm.extractMenuOptions(stateData);

		};



		headerController.$inject = ['$scope', '$state', 'applicationService'];

		return {
			restrict: 'E',
			controller: headerController,
			controllerAs: 'vm',
			scope: {},
			bindToController: {
				menus: '='
			},
			template: require('./header.html')
		};

	}];
})();