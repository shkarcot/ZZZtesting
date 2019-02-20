(function() {
	'use strict';

	//require('./dashboard/dashboard.module.js');

	module.exports = angular.module('console.logging', ['ui.router'])
	    .controller('loggingController', require('./logging.controller.js'))
		//.directive('bodyContentContainer', require('./dashboard.controller.js'));
		 .config(['$stateProvider', function($stateProvider) {
			$stateProvider.state('app.logging', {
				url: '/logging',
				views: {
					'bodyContentContainer@app': {
						template: require('./logging.html'),
						controller: 'loggingController',
						controllerAs: 'lc',
						resolve: {
                          logedIn:function($state){
                              var userData=localStorage.getItem('userInfo');
                              userData=JSON.parse(userData);
                              if(!userData){
                                window.location.href = "http://"+ location.host+"/";
                              }
                          },
                          getUrl: ['$stateParams', 'pipelineServices', function($stateParams, pipelineServices){
                                var loginData = JSON.parse(localStorage.getItem('userInfo'));
                                var sess_id= loginData.sess_id;
                                return pipelineServices.getUrls({'sess_id':sess_id});
                          }]
                        }
					}
				}
			});
		}]);
})();
