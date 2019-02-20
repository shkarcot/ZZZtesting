(function() {
	'use strict';



	module.exports = angular.module('console.customModelDashboard', [])
        .controller('customModelDashboardController', require('./customModelDashboard.controller.js'))
         .directive('ngRightClick', function($parse) {
    return function(scope, element, attrs) {
        var fn = $parse(attrs.ngRightClick);
        element.bind('contextmenu', function(event) {
            scope.$apply(function() {
                event.preventDefault();
                fn(scope, {$event:event});
            });
        });
    };
})
         .config(['$stateProvider', function($stateProvider) {
            $stateProvider.state('app.customModelDashboard', {
               url: '/customModelDashboard',
                views: {
                    'bodyContentContainer@app': {
                        template: require('./customModelDashboard.html'),
                        controller: 'customModelDashboardController',
                        controllerAs: 'mdc',
                        cache :false,
                        resolve: {
                              logedIn:function($state){
                                 var loginData = JSON.parse(localStorage.getItem('userInfo'));
                                 if(!loginData){
                                         $state.go('login');
                                 }
                              }
                        }

                    }
                },

				data: {
					menuConfig: {
						'title': 'Product',
						'iconCls': 'cube'
					}

				}
            });
        }]);
})();