(function() {
	'use strict';

	//require('./dashboard/dashboard.module.js');

	module.exports = angular.module('console.pipeline', ['ui.router'])
	    .controller('pipelineController', require('./pipeline.controller.js'))
		//.directive('bodyContentContainer', require('./dashboard.controller.js'));
		 .config(['$stateProvider', function($stateProvider) {
			$stateProvider.state('app.pipeline', {
				url: '/pipeline',
				views: {
					'bodyContentContainer@app': {
						template: require('./pipeline.html'),
						controller: 'pipelineController',
						controllerAs: 'pc',
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