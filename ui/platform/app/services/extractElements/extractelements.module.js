(function() {
	'use strict';

	//require('./dashboard/dashboard.module.js');
	require('./extractelements.services.js');

	module.exports = angular.module('console.services.extractelements', ['ui.router',
	'console.ExtractElementsServices'
	])
	    .controller('ExtractElementsCtrl', require('./extractelements.controller.js'))
		 .config(['$stateProvider', function($stateProvider) {
			$stateProvider.state('app.services.ExtractElements', {
				url: '/ExtractElements',
				breadcrumb: {state: 'Services', subState: 'Extract Elements' },
				views: {
					'bodyContentContainer@app': {
						template: require('./extractelements.html'),
						controller: 'ExtractElementsCtrl',
						controllerAs: 'eec',
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