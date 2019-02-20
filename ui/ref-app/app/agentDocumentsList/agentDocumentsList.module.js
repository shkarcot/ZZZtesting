(function() {
	'use strict';
	module.exports = angular.module('console.agentDocumentsList', [
	])
        .controller('agentDocumentsListController', require('./agentDocumentsList.controller.js'))
         .config(['$stateProvider', function($stateProvider) {
            $stateProvider.state('app.agentDocumentsList', {
                url: '/agentDocumentsList/:id',
                views: {
                    'bodyContentContainer@app': {
                        template: require('./agentDocumentsList.html'),
                        controller: 'agentDocumentsListController',
                        controllerAs: 'adlc',
                        cache :false,
                        resolve: {
                              logedIn:function($state){
                                 var loginData = JSON.parse(localStorage.getItem('userInfo'));
                                 if(!loginData){
                                         window.location.href = "http://"+ location.host+"/logout";
                                 }
                                 else{
                                   if(loginData.role=='sv'){
                                      $state.go('app.supervisorDashboard')
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