(function() {
	'use strict';
	module.exports = ['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

		//$urlRouterProvider.otherwise('/app/product/list');
		$urlRouterProvider.otherwise('solution');
//		$urlRouterProvider.otherwise('/login');

		$stateProvider.state('/', {
			url: '/',
			abstract: true
		});
	}];
})();