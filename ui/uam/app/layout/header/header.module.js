(function() {
	'use strict';
	module.exports = angular.module('console.layout.header', ['ui.router'])
		.directive('header', require('./header.controller.js'));

})();