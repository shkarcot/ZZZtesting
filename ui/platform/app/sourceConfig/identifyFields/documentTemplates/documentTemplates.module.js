(function() {
	'use strict';
    //require('./services/module.js');
	//require('./dashboard/dashboard.module.js');
	//require('./entitygraph/entitygraph.module.js');
	//require('./solutionsetup/solutionsetup.module.js');

	module.exports = angular.module('console.documentTemplate', [
        //'console.dashboard.entitygraph'
	    //'console.dashboard.solutionsetup'
	    //'console.layout.bodycontent.dashboard.services'
	])
        .controller('documentTemplateController', require('./documentTemplate.controller.js'))
         .config(['$stateProvider', function($stateProvider) {
            $stateProvider.state('app.documentTemplate', {
               url: '/documentTemplate',
                views: {
                    'bodyContentContainer@app': {
                        template: require('./documentTemplates.html'),
                        controller: 'documentTemplateController',
                        controllerAs: 'dtc',
                        cache :false,
                        resolve: {
                              logedIn:function($state){
                                 var loginData = JSON.parse(localStorage.getItem('userInfo'));
                                 if(!loginData){
                                         $state.go('login');
                                 }
                              }
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