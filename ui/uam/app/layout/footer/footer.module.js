(function() {
	'use strict';
	module.exports = angular.module('console.layout.footer', ['ui.router'])
		.directive('footer', require('./footer.controller.js'));

})();