(function() {
	'use strict';

	//require('./dashboard/dashboard.module.js');

	module.exports = angular.module('console.entities', ['ui.router'])
	    .controller('entitiesController', require('./entities.controller.js'))
	    .directive('resspechars', function() {
            function link(scope, elem, attrs, ngModel) {
                ngModel.$parsers.push(function(viewValue) {
                  var reg = /^[^`~!@#$%\^&*()-+={}/\s\-|[\]\\:';"<>?,./]*$/;
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
        .directive('ressynchars', function() {
            function link(scope, elem, attrs, ngModel) {
                ngModel.$parsers.push(function(viewValue) {
                  var reg = /^[^`~!@#$%\^&*()_+={}\-|[\]\\:';"<>?./1-9]*$/;
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
		//.directive('bodyContentContainer', require('./dashboard.controller.js'));
		 .config(['$stateProvider', function($stateProvider) {
			$stateProvider.state('app.entities', {
				url: '/domainObjects',
				views: {
					'bodyContentContainer@app': {
						template: require('./entities.html'),
						controller: 'entitiesController',
						controllerAs: 'ec',
                        resolve: {
                          logedIn:function($state){
                              var userData=localStorage.getItem('userInfo');
                              userData=JSON.parse(userData);
                              if(!userData){
                                window.location.href = "http://"+ location.host+"/";
                              }
                          }
                        }
					}
				}
			});
		}]);
})();