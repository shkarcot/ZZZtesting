(function() {
	'use strict';
	module.exports = angular.module('console.supervisorDocumentsList', [
	])
        .controller('supervisorDocumentsListController', require('./supervisorDocumentsList.controller.js'))
         .config(['$stateProvider', function($stateProvider) {
            $stateProvider.state('app.supervisorDocumentsList', {
                url: '/supervisorDocumentsList/:id',
                views: {
                    'bodyContentContainer@app': {
                        template: require('./supervisorDocumentsList.html'),
                        controller: 'supervisorDocumentsListController',
                        controllerAs: 'sdlc',
                        cache :false,
                        resolve: {
                              logedIn:function($state){
                                 var loginData = JSON.parse(localStorage.getItem('userInfo'));
                                 if(!loginData){
                                         window.location.href = "http://"+ location.host+"/logout";
                                 }
                                 else{
                                   if(loginData.role=='bu'){
                                      $state.go('app.agentDashboard')
                                   }
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