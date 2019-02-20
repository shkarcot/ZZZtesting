(function() {
	'use strict';
	module.exports = angular.module('console.agentDashboard', [
	])
        .controller('agentDashboardController', require('./agentDashboard.controller.js'))
         .config(['$stateProvider', function($stateProvider) {
            $stateProvider.state('app.agentDashboard', {
                url: '/agentDashboard',
                views: {
                    'bodyContentContainer@app': {
                        template: require('./agentDashboard.html'),
                        controller: 'agentDashboardController',
                        controllerAs: 'adbc',
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