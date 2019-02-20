(function() {
	'use strict';


	module.exports = angular.module('console.newDashboard', [

	])
        .controller('newDashBoardController', require('./newDashboard.controller.js'))
         .config(['$stateProvider', function($stateProvider) {
            $stateProvider.state('app.newDashboard', {
                url: '/dashboard',
                views: {
                    'bodyContentContainer@app': {
                        template: require('./newDashboard.html'),
                        controller: 'newDashBoardController',
                        controllerAs: 'ndbc',
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