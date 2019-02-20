(function() {
	'use strict';
	require('./multipleEmailConfig.service.js');

	module.exports = angular.module('console.multipleEmailConfig', [
        'console.multipleEmailConfigServices'
	])
        .controller('multipleEmailConfigController', require('./multipleEmailConfig.controller.js'))
         .config(['$stateProvider', function($stateProvider) {
            $stateProvider.state('app.multipleEmailConfig', {
               url: '/multipleEmailConfig',
                views: {
                    'bodyContentContainer@app': {
                        template: require('./multipleEmailConfig.html'),
                        controller: 'multipleEmailConfigController',
                        controllerAs: 'megc',
                        cache :false,
                        resolve: {
                              logedIn:function($state){
                                 var loginData = JSON.parse(localStorage.getItem('userInfo'));
                                 if(!loginData){
                                         $state.go('login');
                                 }
                              },
                              solutionObj: ['$stateParams', 'multipleEmailConfigService', function($stateParams, multipleEmailConfigService){
                                return multipleEmailConfigService.getSolnId().then(function(data){
                                    return {"solutionId":data.data.solution_id,"caseManagementApiUrl":data.data.case_management_url};
                                });
                              }]
                        }

                    }
                },

				data: {
					menuConfig: {
						'title': 'Product',
						'iconCls': 'cube'
					}

				}
            });
        }]);
})();