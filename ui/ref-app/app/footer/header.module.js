(function() {
	'use strict';
	module.exports = angular.module('cpqAdmin.header', ['ui.router'])
		.directive('aptAdminHeader', require('./header.js'));

})();