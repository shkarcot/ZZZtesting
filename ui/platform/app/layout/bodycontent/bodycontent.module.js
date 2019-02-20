(function() {
	'use strict';
	module.exports = angular.module('console.layout.bodycontent', ['ui.router'])
		.directive('bodyContent', require('./bodycontent.controller.js'));

})();