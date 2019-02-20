(function() {
	'use strict';

	//require('./dashboard/dashboard.module.js');

	module.exports = angular.module('console.dashboard', ['ui.router'])
	    .controller('dashboardController', require('./dashboard.controller.js'))
		//.directive('bodyContentContainer', require('./dashboard.controller.js'));
		 .config(['$stateProvider', function($stateProvider) {
			$stateProvider.state('dashboard', {
				url: '/dashboard',
				views: {
					'pageContent@': {
						template: require('./dashboard.html'),
						controller: 'dashboardController',
						controllerAs: 'dc',
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