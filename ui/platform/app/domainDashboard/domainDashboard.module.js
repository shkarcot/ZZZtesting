(function() {
	'use strict';


	module.exports = angular.module('console.domainDashboard', ['ui.router'])
	    .controller('domainDashboardController', require('./domainDashboard.controller.js'))
		 .config(['$stateProvider', function($stateProvider) {
			$stateProvider.state('app.domainDashboard', {
				url: '/domainDashboard',
				views: {
					'bodyContentContainer@app': {
						template: require('./domainDashboard.html'),
						controller: 'domainDashboardController',
						controllerAs: 'ddc',
                        resolve: {
                          logedIn:function($state){
                              var userData=localStorage.getItem('userInfo');
                              userData=JSON.parse(userData);
                              if(!userData){
                                window.location.href = "http://"+ location.host+"/";
                              }
                          },
                          solutionObj: ['$stateParams', 'bpmnServices', function($stateParams, bpmnServices){
                            return bpmnServices.getSolnId().then(function(data){
                                return {"solutionId":data.data.solution_id,"caseManagementApiUrl":data.data.case_management_url};
                            });
                          }]
                        }
					}
				}
			});
		}]);
})();