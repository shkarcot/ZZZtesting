(function() {
	'use strict';


	module.exports = angular.module('console.multiPage', [

	])
        .controller('multiPageController', require('./multiPage.controller.js'))
         .config(['$stateProvider', function($stateProvider) {
            $stateProvider.state('app.multiPage', {
               url: '/multiPage/:id/:queue',
                views: {
                    'bodyContentContainer@app': {
                        template: require('./multiPage.html'),
                        controller: 'multiPageController',
                        controllerAs: 'mpc',
                        cache :false,
                        resolve: {
                              logedIn:function($state){
                                 var loginData = JSON.parse(localStorage.getItem('userInfo'));
                                 if(!loginData){
                                         window.location.href = "http://"+ location.host+"/";
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