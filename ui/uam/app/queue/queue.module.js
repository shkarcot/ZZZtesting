(function() {
	'use strict';

	module.exports = angular.module('console.queue', ['ui.router'])
	    .controller('queueController', require('./queue.controller.js'))

		 .config(['$stateProvider', function($stateProvider) {
			$stateProvider.state('app.queue', {
				url: '/queue',
				views: {
					'bodyContentContainer@app': {
						template: require('./queue.html'),
						controller: 'queueController',
						controllerAs: 'qc',
						cache:false,
					}
				}
			});
		}]);
})();