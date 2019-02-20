(function() {
	'use strict';

	module.exports = angular.module('console.camundaDiagram', ['ui.router'])
	    .controller('camundaDiagramController', require('./camunda.controller.js'))
		 .config(['$stateProvider', function($stateProvider) {
			$stateProvider.state('app.camunda', {
				url: '/camunda',
				views: {
					'bodyContentContainer@app': {
						template: require('./camunda.html'),
						controller: 'camundaDiagramController',
						controllerAs: 'cdc',
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