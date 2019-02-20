(function() {
	'use strict';
	require('./workFlows.service.js');

	module.exports = angular.module('console.caseManagement', ['ui.router',
	'console.caseManagementServices'
	])
	    .controller('workFlowsCtrl', require('./workFlows.controller.js'))
		 .config(['$stateProvider', function($stateProvider) {
			$stateProvider.state('app.caseManagement', {
				url: '/caseManagement',
				breadcrumb: {state: 'Case Management', subState: '' },
				views: {
					'bodyContentContainer@app': {
						template: require('./workFlows.html'),
						controller: 'workFlowsCtrl',
						controllerAs: 'wfc',
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