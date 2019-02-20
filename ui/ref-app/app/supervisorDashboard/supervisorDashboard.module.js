(function() {
	'use strict';
	module.exports = angular.module('console.supervisorDashboard', [
	])
        .controller('supervisorDashboardController', require('./supervisorDashboard.controller.js'))
         .config(['$stateProvider', function($stateProvider) {
            $stateProvider.state('app.supervisorDashboard', {
                url: '/supervisorDashboard',
                views: {
                    'bodyContentContainer@app': {
                        template: require('./supervisorDashboard.html'),
                        controller: 'supervisorDashboardController',
                        controllerAs: 'sdbc',
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