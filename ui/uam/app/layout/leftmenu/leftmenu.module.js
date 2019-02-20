(function() {
	'use strict';
	module.exports = angular.module('console.layout.leftmenu', ['ui.router'])
		.directive('leftMenu', require('./leftmenu.controller.js'));

})();