(function() {
	'use strict';

	//require('./dashboard/dashboard.module.js');

	module.exports = angular.module('console.unstructuredForm', ['ui.router'])
	    .controller('unstructuredFormController', require('./unstructuredForm.controller.js'))
		//.directive('bodyContentContainer', require('./dashboard.controller.js'));
		 .config(['$stateProvider', function($stateProvider) {
			$stateProvider.state('app.unstructuredForm', {
				url: '/unstructuredForm',
				views: {
					'bodyContentContainer@app': {
						template: require('./unstructuredForm.html'),
						controller: 'unstructuredFormController',
						controllerAs: 'ufc',
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