(function() {
	'use strict';
	module.exports = angular.module('console.login', ['ui.router'])
	.controller('loginController', require('./login.controller.js'))
		//.directive('aptLogin', require('./login.controller.js'));
		.config(['$stateProvider', function($stateProvider) {
			$stateProvider.state('login', {
				url: '/login',
				views: {
					'pageContent@': {
						template: require('./login.html'),
						controller: 'loginController',
						controllerAs: 'lc'
					}
				}

				/*data: {
					menuConfig: {
						'title': 'Product',
						'iconCls': 'cube'
					}

				}*/
			});
		}]);

})();