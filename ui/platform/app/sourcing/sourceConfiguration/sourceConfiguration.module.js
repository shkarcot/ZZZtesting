(function() {
	'use strict';
    //require('./services/module.js');
	//require('./dashboard/dashboard.module.js');
	//require('./entitygraph/entitygraph.module.js');
	//require('./solutionsetup/solutionsetup.module.js');

	module.exports = angular.module('console.sourceConfiguration', [
        //'console.dashboard.entitygraph'
	    //'console.dashboard.solutionsetup'
	    //'console.layout.bodycontent.dashboard.services'
	])
        .controller('sourceConfigurationController', require('./sourceConfiguration.controller.js'))
         .config(['$stateProvider', function($stateProvider) {
            $stateProvider.state('app.source', {
               url: '/source',
                views: {
                    'bodyContentContainer@app': {
                        template: require('./sourceConfiguration.html'),
                        controller: 'sourceConfigurationController',
                        controllerAs: 'scc',
                        cache :false,
                        resolve: {
                              logedIn:function($state){
                                 var loginData = JSON.parse(localStorage.getItem('userInfo'));
                                 if(!loginData){
                                         $state.go('login');
                                 }
                              },
                              emailConfigData: ['$stateParams', 'sourceConfigService', function($stateParams, sourceConfigService){
                                var loginData = JSON.parse(localStorage.getItem('userInfo'));
                                var sess_id= loginData.sess_id;
                                return sourceConfigService.getEmailConfig({'sess_id':sess_id});
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