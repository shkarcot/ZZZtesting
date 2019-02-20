(function() {
	'use strict';

	//require('./dashboard/dashboard.module.js');

	module.exports = angular.module('console.nlp', ['ui.router'])
	    .controller('nlpController', require('./nlp.controller.js'))
		//.directive('bodyContentContainer', require('./dashboard.controller.js'));
		 .config(['$stateProvider', function($stateProvider) {
			$stateProvider.state('app.nlp', {
				url: '/nlp',
				views: {
					'bodyContentContainer@app': {
						template: require('./nlp.html'),
						controller: 'nlpController',
						controllerAs: 'nc',
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