(function() {
	'use strict';

	//require('./dashboard/dashboard.module.js');

	module.exports = angular.module('console.createSolution', ['ui.router'])
	     .controller('createsolutionController', require('./create.controller.js'))
		 .directive('resspechars', function() {
            function link(scope, elem, attrs, ngModel) {
                ngModel.$parsers.push(function(viewValue) {
                  var reg = /^[^`~!@#$%\^&*()-+={}/_|[\]\\:';"<>?,./]*$/;
                  // if view values matches regexp, update model value
                  if (viewValue.match(reg)) {
                    return viewValue;
                  }
                  // keep the model value as it is
                  var transformedValue = ngModel.$modelValue;
                  ngModel.$setViewValue(transformedValue);
                  ngModel.$render();
                  return transformedValue;
                });
            }

            return {
                restrict: 'A',
                require: 'ngModel',
                link: link
            };
         })
		 .config(['$stateProvider', function($stateProvider) {
			$stateProvider.state('app.createSolution', {
				url: '/createSolution',
				views: {
					'bodyContentContainer@app': {
						template: require('./create.html'),
						controller: 'createsolutionController',
						controllerAs: 'csl',
						cache:false,
					}
				}
			});
		}]);
})();