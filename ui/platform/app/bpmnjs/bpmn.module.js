(function() {
	'use strict';
	require('./bpmn.services.js');

	module.exports = angular.module('console.bpmn', ['ui.router',
	    'console.bpmnServices'
	])
	    .controller('bpmnController', require('./bpmn.js'))
		 .config(['$stateProvider', function($stateProvider) {
			$stateProvider.state('app.bpmn', {
				url: '/bpmn',
				views: {
					'bodyContentContainer@app': {
						template: require('./bpmn.html'),
						controller: 'bpmnController',
						controllerAs: 'bpmnCtrl',
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
                                return {"solutionId":data.data.solution_id};
                            });
                          }]
                        }
					}
				},
				params: { selctdBpmnObj: null }
			});
		}]);
})();