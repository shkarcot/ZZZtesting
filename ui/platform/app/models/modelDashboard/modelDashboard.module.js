(function() {
	'use strict';



	module.exports = angular.module('console.modelDashboard', [

	])
        .controller('modelDashboardController', require('./modelDashboard.controller.js'))
         .config(['$stateProvider', function($stateProvider) {
            $stateProvider.state('app.modelDashboard', {
               url: '/modelDashboard',
                views: {
                    'bodyContentContainer@app': {
                        template: require('./modelDashboard.html'),
                        controller: 'modelDashboardController',
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