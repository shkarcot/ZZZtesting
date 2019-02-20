(function() {
	'use strict';

	module.exports = angular.module('console.newUnstructuredForm', ['ui.router'])
	    .controller('newUnstructuredFormController', require('./newUnstructuredForm.controller.js'))
		//.directive('bodyContentContainer', require('./dashboard.controller.js'));
		 .config(['$stateProvider', function($stateProvider) {
			$stateProvider.state('app.newUnstructuredForm', {
				url: '/newUnstructuredForm/:id',
				views: {
					'bodyContentContainer@app': {
						template: require('./newUnstructuredForm.html'),
						controller: 'newUnstructuredFormController',
						controllerAs: 'nufc',
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