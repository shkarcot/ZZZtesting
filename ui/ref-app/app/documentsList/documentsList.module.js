(function() {
	'use strict';
    //require('./services/module.js');
	//require('./dashboard/dashboard.module.js');
	//require('./entitygraph/entitygraph.module.js');
	//require('./solutionsetup/solutionsetup.module.js');

	module.exports = angular.module('console.documentsList', [
        //'console.dashboard.entitygraph'
	    //'console.dashboard.solutionsetup'
	    //'console.layout.bodycontent.dashboard.services'
	])
        .controller('documentsListController', require('./documentsList.controller.js'))
         .config(['$stateProvider', function($stateProvider) {
            $stateProvider.state('app.documentsList', {
                url: '/documentsList',
                views: {
                    'bodyContentContainer@app': {
                        template: require('./documentsList.html'),
                        controller: 'documentsListController',
                        controllerAs: 'dlc',
                        cache :false,
                        resolve: {
                              logedIn:function($state){
                                 var loginData = JSON.parse(localStorage.getItem('userInfo'));
                                 if(!loginData){
                                         window.location.href = "http://"+ location.host+"/";
                                 }
                              }

//                              documentData: ['$stateParams', 'dashboardService', function($stateParams, dashboardService){
//                                  var loginData = JSON.parse(localStorage.getItem('userInfo'));
//                                  var sess_id= loginData.sess_id;
//                                  return dashboardService.getDocumentLevelData({'sess_id':sess_id,'days':'30d'});
//                              }],
//                              listDays: ['$stateParams', 'dashboardService', function($stateParams, dashboardService){
//                                var loginData = JSON.parse(localStorage.getItem('userInfo'));
//                                var sess_id= loginData.sess_id;
//                                return dashboardService.getListDays({'sess_id':sess_id});
//                              }],
//                              fieldData: ['$stateParams', 'dashboardService', function($stateParams, dashboardService){
//                                  var loginData = JSON.parse(localStorage.getItem('userInfo'));
//                                  var sess_id= loginData.sess_id;
//                                  return dashboardService.getFieldLevelData({'sess_id':sess_id,'days':'30d'});
//                              }],
//                              getDocumentTypes: ['$stateParams', 'dashboardService', function($stateParams, dashboardService){
//                                var loginData = JSON.parse(localStorage.getItem('userInfo'));
//                                var sess_id= loginData.sess_id;
//                                return dashboardService.getDocumentTypesList({'sess_id':sess_id});
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