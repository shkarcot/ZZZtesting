(function() {
	'use strict';
    //require('./services/module.js');
	//require('./dashboard/dashboard.module.js');
	//require('./entitygraph/entitygraph.module.js');
	//require('./solutionsetup/solutionsetup.module.js');

	module.exports = angular.module('console.entityLinking', [
        //'console.dashboard.entitygraph'
	    //'console.dashboard.solutionsetup'
	    //'console.layout.bodycontent.dashboard.services'
	])
        .controller('entityLinkingController', require('./entityLinking.controller.js'))
         .config(['$stateProvider', function($stateProvider) {
            $stateProvider.state('app.entityLinking', {
               url: '/entityLinking/:id/:type/:queue',
                views: {
                    'bodyContentContainer@app': {
                        template: require('./entityLinking.html'),
                        controller: 'entityLinkingController',
                        controllerAs: 'el',
                        cache :false,
                        resolve: {
                              logedIn:function($state){
                                 var loginData = JSON.parse(localStorage.getItem('userInfo'));
                                 if(!loginData){
                                         window.location.href = "http://"+ location.host+"/logout";
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