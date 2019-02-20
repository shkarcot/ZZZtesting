(function() {
	'use strict';
    //require('./services/module.js');
	//require('./dashboard/dashboard.module.js');
	//require('./entitygraph/entitygraph.module.js');
	//require('./solutionsetup/solutionsetup.module.js');

	module.exports = angular.module('console.processDetails', [
        //'console.dashboard.entitygraph'
	    //'console.dashboard.solutionsetup'
	    //'console.layout.bodycontent.dashboard.services'
	])
        .controller('processDetailsController', require('./processDetails.controller.js'))
         .config(['$stateProvider', function($stateProvider) {
            $stateProvider.state('app.processDetails', {
               url: '/processDetails/details/:id/:type',
                views: {
                    'bodyContentContainer@app': {
                        template: require('./processDetails.html'),
                        controller: 'processDetailsController',
                        controllerAs: 'pdc',
                        cache :false,
                        resolve: {
                              logedIn:function($state){
                                 var loginData = JSON.parse(localStorage.getItem('userInfo'));
                                 if(!loginData){
                                         window.location.href = "http://"+ location.host+"/";
                                 }
                              }
//                              processListDetails: ['$stateParams', 'processDetailsServices', function($stateParams, processDetailsServices){
//                                    var loginData = JSON.parse(localStorage.getItem('userInfo'));
//                                    var sess_id= loginData.sess_id;
//                                    return processDetailsServices.postProcessList($stateParams.id,sess_id);
//                              }]
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