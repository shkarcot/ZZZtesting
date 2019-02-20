(function() {
	'use strict';

	module.exports = angular.module('console.createUser', ['ui.router'])
	    .controller('createUserController', require('./createUser.controller.js'))

		 .config(['$stateProvider', function($stateProvider) {
			$stateProvider.state('app.createUser', {
				url: '/createUser/:id',
				views: {
					'bodyContentContainer@app': {
						template: require('./createUser.html'),
						controller: 'createUserController',
						controllerAs: 'cu',
						cache:false,
					}
				}
			});
		}]);
})();