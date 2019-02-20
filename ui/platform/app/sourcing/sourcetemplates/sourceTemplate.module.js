(function() {
	'use strict';

	//require('./dashboard/dashboard.module.js');

	module.exports = angular.module('console.sourceTemplate', ['ui.router'])
	    .controller('sourceTemplateController', require('./sourceTemplate.controller.js'))
		//.directive('bodyContentContainer', require('./dashboard.controller.js'));
		 .config(['$stateProvider', function($stateProvider) {
			$stateProvider.state('app.sourcetemplate', {
				url: '/sourcetemplate',
				views: {
					'bodyContentContainer@app': {
						template: require('./sourceTemplate.html'),
						controller: 'sourceTemplateController',
						controllerAs: 'stc',
                        resolve: {
                          logedIn:function($state){
                              var userData=localStorage.getItem('userInfo');
                              userData=JSON.parse(userData);
                              if(!userData){
                                window.location.href = "http://"+ location.host+"/";
                              }
                          },
                          entitiesList: ['$stateParams', 'entitiesService', function($stateParams, entitiesService){
                                var loginData = JSON.parse(localStorage.getItem('userInfo'));
                                var sess_id= loginData.sess_id;
                                return entitiesService.getEntities({'sess_id':sess_id});
                            }],
                          getTemplates: ['$stateParams', 'sourceTemplateService', function($stateParams, sourceTemplateService){
                                  var loginData = JSON.parse(localStorage.getItem('userInfo'));
                                  var sess_id= loginData.sess_id;
                                  return sourceTemplateService.getTemplates({'sess_id':sess_id});
                            }]
                        }
					}
				}
			});
		}]);
})();