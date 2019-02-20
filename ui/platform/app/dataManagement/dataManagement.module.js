(function() {
	'use strict';

	module.exports = angular.module('console.dataManagement', ['ui.router'])
	    .controller('dataManagementController', require('./dataManagement.controller.js'))
		 .config(['$stateProvider', function($stateProvider) {
			$stateProvider.state('app.dataManagement', {
				url: '/terminology',
				views: {
					'bodyContentContainer@app': {
						template: require('./dataManagement.html'),
						controller: 'dataManagementController',
						controllerAs: 'dmc',
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
