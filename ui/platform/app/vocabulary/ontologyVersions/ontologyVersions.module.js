(function() {
	'use strict';

	module.exports = angular.module('console.ontologyVersions', ['ui.router'])
	    .controller('ontologyVersionsController', require('./ontologyVersions.controller.js'))
		 .config(['$stateProvider', function($stateProvider) {
			$stateProvider.state('app.ontologyversions', {
				url: '/ontologyversions/:id',
				views: {
					'bodyContentContainer@app': {
						template: require('./ontologyVersions.html'),
						controller: 'ontologyVersionsController',
						controllerAs: 'ovc',
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